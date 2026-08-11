-- ENUMS
CREATE TYPE public.app_role AS ENUM ('owner','employee','client');
CREATE TYPE public.perm_level AS ENUM ('none','read','write');
CREATE TYPE public.client_status AS ENUM ('lead','active','dormant','blocked');
CREATE TYPE public.order_status AS ENUM ('quote','confirmed','in_production','installed','closed','cancelled');
CREATE TYPE public.invoice_status AS ENUM ('draft','sent','partially_paid','paid','overdue','cancelled');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  phone text,
  company text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('owner','employee'));
$$;

-- STAFF INVITES
CREATE TABLE public.staff_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text,
  created_by uuid,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_invites TO authenticated;
GRANT ALL ON public.staff_invites TO service_role;
ALTER TABLE public.staff_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages invites" ON public.staff_invites FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'owner')) WITH CHECK (public.has_role(auth.uid(),'owner'));

-- PERMISSIONS
CREATE TABLE public.staff_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resource text NOT NULL,
  level public.perm_level NOT NULL DEFAULT 'none',
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, resource)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff_permissions TO authenticated;
GRANT ALL ON public.staff_permissions TO service_role;
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner manages permissions" ON public.staff_permissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'owner')) WITH CHECK (public.has_role(auth.uid(),'owner'));
CREATE POLICY "Staff read own permissions" ON public.staff_permissions FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- CLIENTS
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE,
  company_name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  status public.client_status NOT NULL DEFAULT 'lead',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.my_client_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.clients WHERE profile_id = auth.uid() LIMIT 1;
$$;

-- PROFILE / ROLE POLICIES (need is_staff)
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'owner'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'owner'));
CREATE POLICY "Users read roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE POLICY "Staff manage clients" ON public.clients FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own record" ON public.clients FOR SELECT TO authenticated
  USING (profile_id = auth.uid());
CREATE POLICY "Clients update own record" ON public.clients FOR UPDATE TO authenticated
  USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  unit text NOT NULL DEFAULT 'pc',
  price numeric(12,2) NOT NULL DEFAULT 0,
  stock_qty numeric(12,2) NOT NULL DEFAULT 0,
  reorder_level numeric(12,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage products" ON public.products FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  delta numeric(12,2) NOT NULL,
  reason text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_movements TO authenticated;
GRANT ALL ON public.stock_movements TO service_role;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage stock movements" ON public.stock_movements FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.apply_stock_movement()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.products SET stock_qty = stock_qty + NEW.delta WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_apply_stock_movement AFTER INSERT ON public.stock_movements
FOR EACH ROW EXECUTE FUNCTION public.apply_stock_movement();

-- ORDERS
CREATE SEQUENCE public.order_number_seq START 1000;
CREATE SEQUENCE public.invoice_number_seq START 1000;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('SO-' || nextval('public.order_number_seq')),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  status public.order_status NOT NULL DEFAULT 'quote',
  title text,
  site_address text,
  notes text,
  expected_date date,
  total numeric(12,2) NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage orders" ON public.orders FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own orders" ON public.orders FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  description text NOT NULL,
  qty numeric(12,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage order items" ON public.order_items FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own order items" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.client_id = public.my_client_id()));

CREATE TABLE public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.order_status NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_events TO authenticated;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage order events" ON public.order_events FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own order events" ON public.order_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.client_id = public.my_client_id()));

CREATE OR REPLACE FUNCTION public.recalc_order_total()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _order uuid;
BEGIN
  _order := COALESCE(NEW.order_id, OLD.order_id);
  UPDATE public.orders o SET total = COALESCE((
    SELECT SUM(qty * unit_price) FROM public.order_items WHERE order_id = _order
  ),0), updated_at = now() WHERE o.id = _order;
  RETURN NULL;
END;
$$;
CREATE TRIGGER trg_recalc_order_total AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.recalc_order_total();

CREATE OR REPLACE FUNCTION public.log_order_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_events (order_id, status, created_by) VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_log_order_status AFTER INSERT OR UPDATE OF status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_status();

-- INVOICES
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE DEFAULT ('INV-' || nextval('public.invoice_number_seq')),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  status public.invoice_status NOT NULL DEFAULT 'draft',
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  vat_rate numeric(5,2) NOT NULL DEFAULT 18,
  total numeric(12,2) NOT NULL DEFAULT 0,
  paid_amount numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage invoices" ON public.invoices FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own invoices" ON public.invoices FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());

-- FILES
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  name text NOT NULL,
  path text NOT NULL,
  mime text,
  size_bytes bigint,
  visible_to_client boolean NOT NULL DEFAULT true,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.files TO authenticated;
GRANT ALL ON public.files TO service_role;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage files" ON public.files FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own files" ON public.files FOR SELECT TO authenticated
  USING (visible_to_client AND client_id = public.my_client_id());
CREATE POLICY "Clients upload own files" ON public.files FOR INSERT TO authenticated
  WITH CHECK (client_id = public.my_client_id());

-- QUOTE REQUESTS
CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  name text NOT NULL,
  company text,
  email text,
  phone text,
  service text,
  message text,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
GRANT INSERT ON public.quote_requests TO anon;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a quote request" ON public.quote_requests FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Staff manage quote requests" ON public.quote_requests FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients read own quote requests" ON public.quote_requests FOR SELECT TO authenticated
  USING (client_id = public.my_client_id());

-- NEW USER HANDLING
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _wants_staff boolean := COALESCE(NEW.raw_user_meta_data->>'account_type','client') = 'staff';
  _has_owner boolean := EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner');
  _invited boolean := EXISTS (SELECT 1 FROM public.staff_invites WHERE lower(email) = lower(NEW.email));
  _role public.app_role := 'client';
  _new_client uuid;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, company)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone', NEW.raw_user_meta_data->>'company');

  IF _wants_staff AND NOT _has_owner THEN
    _role := 'owner';
  ELSIF _wants_staff AND _invited THEN
    _role := 'employee';
    UPDATE public.staff_invites SET accepted_at = now() WHERE lower(email) = lower(NEW.email);
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  IF _role = 'client' THEN
    INSERT INTO public.clients (profile_id, company_name, contact_name, email, phone, status)
    VALUES (NEW.id,
            COALESCE(NULLIF(NEW.raw_user_meta_data->>'company',''), COALESCE(NEW.raw_user_meta_data->>'full_name','New client')),
            NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'phone', 'lead')
    RETURNING id INTO _new_client;
  ELSIF _role = 'employee' THEN
    INSERT INTO public.staff_permissions (user_id, resource, level)
    SELECT NEW.id, r, 'none'::public.perm_level
    FROM unnest(ARRAY['clients','orders','products','invoices','files','settings']) AS r;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SEED CATALOGUE
INSERT INTO public.products (sku, name, category, unit, price, stock_qty, reorder_level) VALUES
  ('RK-UPR-6M','Pallet racking upright frame 6m','Racking','pc',480000,42,10),
  ('RK-BEAM-27','Pallet racking beam 2.7m','Racking','pc',95000,180,40),
  ('RK-DECK-STD','Steel deck panel 1200x900','Racking','pc',72000,96,24),
  ('SH-BOLTLESS-5','Boltless shelving bay 5 levels','Shelving','bay',420000,30,8),
  ('SH-GONDOLA-2','Gondola shelving 2m double sided','Shelving','bay',610000,12,4),
  ('AC-COL-GUARD','Column guard protector','Accessories','pc',48000,60,15),
  ('AC-MESH-PNL','Mesh back panel','Accessories','pc',55000,25,10),
  ('AC-LABEL-KIT','Rack labelling kit','Accessories','set',30000,18,6);