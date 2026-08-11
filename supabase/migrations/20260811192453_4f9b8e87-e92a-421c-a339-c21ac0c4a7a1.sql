REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.apply_stock_movement() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.recalc_order_total() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_order_status() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.my_client_id() FROM anon, public;