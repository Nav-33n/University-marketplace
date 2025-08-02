import API from "../../../services/api";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import SellerOrderCard from "./SellerOrderCard";
import OtpInput from "./otpInput";

export default function ConfirmOrder({ userToken }) {
  const {
    data: sellerNotify = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["seller"],
    queryFn: async () => {
      const res = await API.get("/orders/seller", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <p className="p-4">Loading items...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load items.</p>;
  if (!sellerNotify || sellerNotify.length === 0)
    return <p className="p-4 text-red-500">Waiting for your first buyer.</p>;

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {sellerNotify.map((item, index) => (
        <div
          key={index}
          className="bg-cyan-200 w-full grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[200px_350px_450px_250px] mb-4 py-2 rounded-xl overflow-hidden"
        >
          {/* Image Section */}
          <div className="flex justify-center items-center ">
            <div className="flex w-40 h-40 justify-center items-center rounded-2xl bg-amber-200">
              <img
                src={item.itemImageURL}
                alt="Main Product"
                className=" w-38 h-38 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="flex flex-col">
            <span className="inline-flex items-center max-w-[350px] group relative mb-2">
              <span className="text-[#546e88] font-semibold italic mr-1">
                Title:
              </span>
              <span className="font-normal text-[#010101c8] uppercase line-clamp-1 overflow-hidden text-ellipsis">
                {item.itemTitle}
              </span>

              {/* Tooltip */}
              <div className="absolute left-0 top-full mt-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs px-2 py-1 rounded max-w-xs whitespace-normal pointer-events-none">
                {item.itemTitle}
              </div>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Buyer:{" "}
              <span className="font-normal text-black text-sm">
                {item.buyer.name} ({item.department})
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Price:{" "}
              <span className="font-normal text-black text-sm">
                ₹{item.price}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Buyer's Contact:{" "}
              <span className="font-normal text-black text-sm">
                {item.buyer.phone}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Status:{" "}
              <span className="font-normal text-black text-sm">
                {item.status}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Purchase Date:{" "}
              <span className="font-normal text-black text-sm">
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
              </span>
            </span>
          </div>

          {/* Address Section */}
          <div className="flex flex-col pl-4">
            <h2 className="flex items-center font-semibold gap-1 text-black mb-3">
              <MapPin size={16} />
              Meet Up Location
            </h2>
            <div className="gap-1 flex-col flex">
              <h3 className="text-black font-semibold">
                Place:
                <span className="font-light capitalize text-wrap">
                  {" "}
                  {item.place}{" "}
                </span>
              </h3>
              <h3 className="text-black font-semibold">
                {" "}
                Address/Building:{" "}
                <span className="font-light capitalize text-wrap">
                  {item.address}
                </span>
              </h3>
              <span className="text-[#546e88] font-semibold italic ">
                OTP:{" "}
                <span className="font-normal text-black text-sm">
                  {item.otp.seller}
                </span>
              </span>
              <span className="text-[#546e88] font-semibold italic ">
                Send before:{" "}
                <span className="font-normal text-black text-sm">
                  {new Date(item.otp.expiresAt).toLocaleDateString("en-GB")}
                </span>
              </span>
            </div>
          </div>
          {item.status === "waiting-confirmation" ? (
            <SellerOrderCard
              key={item._id}
              item={item._id}
              userToken={userToken}
            />
          ) : item.status === "exchange-verified" ? (
            <div>
              <span className="text-[#546e88] font-semibold italic mr-8">
                Successfully Verified.
              </span>
            </div>
          ) : item.status === "dealed-closed" ? (
            <div>
              <span className="text-[#546e88] font-semibold italic mr-8">
                Order Successfully Delivered.
              </span>
            </div>
          ) : (
            <OtpInput
              orderId={item._id}
              expired={item.otp.expiresAt}
              userToken={userToken}
            />
          )}
        </div>
      ))}
    </div>
  );
}
