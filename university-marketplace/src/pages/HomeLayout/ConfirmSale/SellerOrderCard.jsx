import { useForm } from "react-hook-form";
import API from "../../../services/api";
import { useQueryClient } from "@tanstack/react-query";

export default function SellerOrderCard({ item, userToken }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const payload = {
        contact: data.sellerContact,
        deliveryDate: data.deliveryDate,
      };

      await API.post(`/orders/update/${item}`, payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      alert("Meetup details submitted!");
      queryClient.invalidateQueries(["seller"]);
      queryClient.invalidateQueries(["purchase"]);
      window.location.reload();
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-semibold text-sm text-black">
          Your Contact
        </label>
        <input
          {...register("sellerContact", {
            required: true,
            pattern: /^[0-9]{10}$/,
          })}
          placeholder="Enter phone number"
          className="w-full border rounded px-2 py-1 text-black"
        />
        {errors.sellerContact && (
          <p className="text-red-600 text-sm">Contact is required</p>
        )}
      </div>

      <div>
        <label className="block font-semibold text-black text-sm">
          Delivery Date
        </label>
        <input
          type="date"
          {...register("deliveryDate", {
            required: true,
          })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.deliveryDate && (
          <p className="text-red-600 text-sm">{errors.deliveryDate.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-cyan-600 hover:bg-cyan-800 text-white px-4 py-2 rounded-md w-full"
      >
        Confirm Meetup Details
      </button>
    </form>
  );
}
