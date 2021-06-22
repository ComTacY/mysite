CREATE VIEW AS
	view_qualification_training_employee_site						AS
SELECT
	tr_emp_site.qualification_training_employee_site_id		AS	qualification_training_employee_site_id,
	tr_emp_site.qualification_training_employee_id				AS	qualification_training_employee_id ,
	tr_emp_site.site_id																AS	site_id ,
	st.site_name																			AS	site_name,
	tr_emp_site.is_needed_attendance									AS	is_needed_attendance ,
	tr_emp_site.attended_on													AS	attended_on ,
	tr_emp_site.expiration_on													AS	expiration_on ,
	tr_emp_site.deadline_on														AS	deadline_on ,
	tr_emp_site.created_at														AS	created_at ,
	tr_emp_site.updated_at														AS	updated_at ,
	tr_emp_site.updated_by														AS	updated_by
FROM
	trans_qualification_training_employee_site		AS	tr_emp_site
	LEFT JOIN	mst_site		AS	st		ON		tr_emp_site.site_id	=		st.site_id
;