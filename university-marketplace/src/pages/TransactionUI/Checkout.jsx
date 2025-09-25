import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { UserRoundPen, MapPin } from "lucide-react";
import API from "../../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import DateDropdown from "./DateDropDown";

export default function Checkout({ userToken }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();
  const location = useLocation();
  const { id, img, title, price, type } = location.state || {};
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);

    if (type === "Rent") {
      try {
        const rentPayload = {
          itemId: id,
          department: data.department,
          place: data.place,
          address: data.address,
          phone: data.phone,
          totalDays: Number(selectedDate),
          terms: data.terms,
        };
        await API.post("/orders/rental-create", rentPayload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        alert("Successful Place Order");
        queryClient.invalidateQueries(["items"]);
        navigate("/purchase");
      } catch (err) {
        console.log("An error Occurred: ", err);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const payload = {
          itemId: id,
          department: data.department,
          place: data.place,
          address: data.address,
          phone: data.phone,
          terms: data.terms,
        };
        await API.post("/orders/create", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });
        alert("Successful Place Order");
        queryClient.invalidateQueries(["items"]);
        navigate("/purchase");
      } catch (err) {
        console.log("An error Occurred: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const perDay = Number(price) || 0;

  const total = perDay * (selectedDate || 0);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col lg:flex-row gap-8 p-6 bg-white min-h-screen shadow-2xl rounded-md pb-20"
    >
      {/* Left Section */}
      <div className="flex-1 space-y-8">
        <div className="flex">
          <h1 className="font-semibold text-4xl text-cyan-400 tracking-wider">
            Checkout
          </h1>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-black">
            <UserRoundPen size={20} className="text-black" />
            1. Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("phone", {
                required: true,
                pattern: /^[0-9]{10}$/,
              })}
              placeholder="Phone"
              className="input text-black border rounded-md pl-1"
            />
            <input
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+\.\S+$/,
              })}
              placeholder="Email"
              className="input text-black border rounded-md pl-1"
            />
          </div>
          {/* Errors */}
          <div className="text-red-500 text-sm mt-1">
            {errors.phone && "Valid 10-digit phone number required"}
            <br />
            {errors.email && "Valid email is required"}
          </div>
        </div>

        {/* Delivery Info */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-black">
            <MapPin size={20} className="text-black" />
            2. Meet Up Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              {...register("department", { required: true })}
              className="input border rounded-md pl-1 text-black"
            >
              <option value="">Choose Department</option>
              <optgroup label="Science">
                <option value="Chemistry">🧪 Chemistry</option>
                <option value="Biology">🧬 Biology</option>
              </optgroup>
              <optgroup label="Technology">
                <option value="Computer Science">💻 Computer Science</option>
                <option value="Engineering">📐 Engineering</option>
              </optgroup>
            </select>
            <input
              {...register("place", { required: true })}
              placeholder="Place e.g: Canteen, Auditorium"
              maxLength="40"
              className="input text-black border rounded-md pl-1"
            />
            <input
              {...register("address", { required: true })}
              placeholder="Department/Building"
              maxLength="80"
              className="input col-span-2 text-black border rounded-md pl-1"
            />
          </div>
          {/* Errors */}
          <div className="text-red-500 text-sm mt-1">
            {errors.department && "Department is required"}
            <br />
            {errors.city && "City is required"}
            <br />
            {errors.address && "Address is required"}
          </div>
        </div>
        {/* Rental Dates */}
        {type === "Rent" && (
          <DateDropdown
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {errors.selectedDate === "" && (
          <p className="text-red-500 text-sm mt-1">
            Please select a valid date range (max 7 days).
          </p>
        )}
        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm w-fit mb-3">
          Cash on Delivery (COD) Only
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[350px] bg-gray-100 rounded-lg p-5 text-black">
        <h3 className="text-xl font-semibold mb-4">Order</h3>
        {/* Product Info */}
        <div className="flex gap-4 mb-4 hover:shadow-md transition-shadow duration-300 p-2 rounded-lg bg-white">
          <img
            src={img}
            alt="Product"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h4 className="text-md font-semibold">{title}</h4>
            <p className="text-lg font-bold text-cyan-700 mt-2">
              ₹{type === "Rent" ? `${price}/Day` : price}
            </p>
          </div>
        </div>

        {/* Price Summary */}
        <div className="mt-4 bg-white p-3 rounded-lg border">
          <div className="flex justify-between text-sm">
            <span>Per Day</span>
            <span className="font-medium">₹{perDay}</span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span>Selected Days</span>
            {<span className="font-medium">{selectedDate || 0}</span>}
          </div>

          <div className="border-t mt-3 pt-3 flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-cyan-700">
              ₹{isNaN(total) ? 0 : total}
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            {...register("terms", { required: true })}
            className="mt-1"
          />
          <p className="text-sm text-gray-700">
            By confirming the order, I accept the{" "}
            <span className="text-blue-500 underline cursor-pointer">
              terms of the user agreement
            </span>
            .
          </p>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1">You must accept the terms</p>
        )}

        {/* Checkout Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-cyan-600 hover:bg-cyan-800 text-white py-3 rounded-md cursor-pointer"
        >
          {loading ? "Placing Order..." : "Checkout →"}
        </button>
      </div>
    </form>
  );
}
