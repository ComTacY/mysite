drop view
		view_qualification_training_employee;
Create view
		view_qualification_training_employee AS
SELECT 
		tr_emp.qualification_training_employee_id		AS	qualification_training_employee_id ,
		tr_emp.qualification_training_id							AS	qualification_training_id ,
		tr_emp.employee_id											AS	employee_id ,
		tr_emp.is_needed_attendance							AS	is_needed_attendance ,
		tr_emp.attended_on											AS	attended_on ,
		tr_emp.expiration_on											AS	expiration_on ,
		tr_emp.deadline_on												AS	deadline_on ,
		tr_emp.is_reminder_sent_first							AS	is_reminder_sent_first,
		tr_emp.is_reminder_sent_second						AS	is_reminder_sent_second,
		tr_emp.created_at												AS	created_at ,
		tr_emp.updated_at												AS	updated_at ,
		tr_emp.updated_by												AS	updated_by ,
		tr.qualification_training_name							AS	qualification_training_name,
		tr.category_id														AS	category_id ,
		tr.class_id																AS	class_id ,
		tr.is_site_separeted												AS	is_site_separeted ,
		tr.has_expiration_day											AS	has_expiration_day ,
		tr.expiration_days													AS	expiration_days ,
		ct.category_name													AS	category_name ,
		ct.is_manager_entry											AS	is_manager_entry ,
		cl.class_name														AS	class_name ,
		em.login_id															AS	login_id
FROM
		trans_qualification_training_employee				AS	tr_emp
		LEFT JOIN mst_qualification_training 				AS	tr		ON tr_emp.qualification_training_id	=	tr.qualification_training_id
		LEFT JOIN mst_category										AS	ct		ON tr.category_id									=	ct.category_id
		LEFT JOIN mst_class												AS	cl		ON tr.class_id										=	cl.class_id
		LEFT JOIN mst_employee									AS	em	ON tr_emp.employee_id						=	em.employee_id
;
