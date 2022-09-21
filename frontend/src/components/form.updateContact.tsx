import { useForm } from "react-hook-form";

import { ContactSchema } from "../types/contacts.models";
import { axiosObj } from "../utils/axios.utils";

function Form() {
  const { register, handleSubmit, reset } = useForm<
    ContactSchema & { _id: string }
  >();
  const onSubmit = async (data: ContactSchema & { _id: string }) => {
    const curr = await axiosObj.get<ContactSchema & { _id: string }>(
      `api/contacts/${data._id}`
    );

    if (!curr.data) {
      console.log(`unable to get ${data._id}`);
    }

    data.email = data.email || curr.data.email;
    data.gender = data.gender || curr.data.gender;
    data.name = data.name || curr.data.name;
    data.phone = data.phone || curr.data.phone;

    axiosObj
      .patch(`api/contacts/${data._id}`, data)
      .then(() => reset())
      .catch(() => {
        console.log(`unable to update ${data._id} with`, data);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" id="ID" placeholder="ID" {...register("_id")} />
      <input
        type="text"
        id="name"
        placeholder="name"
        {...register("name", {
          required: true,
          minLength: {
            message: "name should be at least 1 character",
            value: 1,
          },
        })}
      />

      <input
        type="email"
        id="email"
        placeholder="email"
        {...register("email", {
          required: true,
          minLength: {
            message: "email should be at least 1 character",
            value: 1,
          },
        })}
      />

      <input
        type="text"
        id="gender"
        placeholder="gender"
        {...register("gender")}
      />

      <input
        type="tel"
        id="phone"
        placeholder="phone number"
        {...register("phone")}
      />

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
      >
        <input type="submit" value={"Update"} />
      </button>
    </form>
  );
}

export default Form;
