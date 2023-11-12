'use client'

import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import YupPassword from 'yup-password';
import ErrorLine from '@/components/ErrorLine';
import api from '@/api';

YupPassword(Yup);

export default function RegistrationForm() {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      retypedPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50)
        .min(2)
        .required(),
      username: Yup.string().max(20).min(3).required(),
      password: Yup.string().password().required(),
      retypedPassword: Yup.string().oneOf([Yup.ref('password'), undefined], "Passwords don't match").required(),
    }),
    onSubmit: async (values) => {
      const requestData = {
        full_name: values.name,
        username: values.username,
        password: values.password,
      }
      const resp = await api.createUser(requestData);
      if (!resp.ok) return;

      router.push('/login');
    },
  });


  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.name && formik.errors.name && (
                  <ErrorLine message={formik.errors.name} />
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  onBlur={formik.handleBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.username && formik.errors.username && (
                <ErrorLine message={formik.errors.username} />
              )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.password && formik.errors.password && (
                <ErrorLine message={formik.errors.password} />
              )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="retypedPassword" className="block text-sm font-medium leading-6 text-gray-900">
                Re-type Password
              </label>
              <div className="mt-2">
                <input
                  id="retypedPassword"
                  name="retypedPassword"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.retypedPassword}
                  onBlur={formik.handleBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.retypedPassword && formik.errors.retypedPassword && (
                <ErrorLine message={formik.errors.retypedPassword} />
              )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Register
        </button>
      </div>
    </form>
  )
}
