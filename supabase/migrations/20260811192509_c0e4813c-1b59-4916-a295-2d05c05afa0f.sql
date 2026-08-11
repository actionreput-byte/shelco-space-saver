CREATE POLICY "Staff manage crm files" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'crm-files' AND public.is_staff(auth.uid()))
WITH CHECK (bucket_id = 'crm-files' AND public.is_staff(auth.uid()));

CREATE POLICY "Clients read own crm files" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'crm-files' AND (storage.foldername(name))[1] = public.my_client_id()::text);