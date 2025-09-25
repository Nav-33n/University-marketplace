import API from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import OtpInput from "../HomeLayout/ConfirmSale/otpInput";

export default function Purchase({ userToken }) {
  const {
    data: purchaseItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["purchase"],
    queryFn: async () => {
      try {
        const res = await API.get("/orders/purchase", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        return res.data;
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <p className="p-4">Loading items...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load items.</p>;
  if (!purchaseItems || purchaseItems.length === 0)
    return (
      <p className="p-4 text-red-500">You have not purchased any items yet.</p>
    );

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {purchaseItems.map((item, index) => (
        <div
          key={index}
          className="bg-cyan-200 w-full h-[184px] grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-[200px_350px_450px_250px] mb-4 py-2 rounded-xl overflow-hidden"
        >
          {/* Image Section */}
          <div className="flex justify-center items-center ">
            <div className="flex w-40 h-40 justify-center items-center rounded-2xl bg-amber-200">
              <img
                src={item.itemSnapshot.imageURL}
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
                {item.itemSnapshot.title}
              </span>

              {/* Tooltip */}
              <div className="absolute left-0 top-full mt-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs px-2 py-1 rounded max-w-xs whitespace-normal pointer-events-none">
                {item.itemSnapshot.title}
              </div>
            </span>

            <span className="text-[#546e88] font-semibold italic ">
              Seller:{" "}
              <span className="font-normal text-black text-sm">
                {item.seller.name}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Price:{" "}
              <span className="font-normal text-black text-sm">
                ₹{item.price || item.rentalDetails.pricePerDay}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Type:{" "}
              <span className="font-normal text-black text-sm capitalize">
                {item.orderType}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Status:{" "}
              <span className="font-normal text-black text-sm">
                {item.status}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Order Date:{" "}
              <span className="font-normal text-black text-sm">
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
              </span>
            </span>
          </div>

          {/* Meet-Up section */}
          <div className="flex flex-col pl-4">
            <h2 className="flex items-center font-semibold gap-1 text-black mb-3">
              <MapPin size={16} />
              Meet Up Location
            </h2>
            <div className="gap-1 flex-col flex">
              <h3 className="text-black font-semibold  text-wrap">
                Place:
                <span className="font-light capitalize">
                  {" "}
                  {item.itemSnapshot.place}{" "}
                </span>
              </h3>
              <h3 className="text-black font-semibold  text-wrap">
                {" "}
                Address/Building:{" "}
                <span className="font-light capitalize">
                  {item.itemSnapshot.address}
                </span>
              </h3>
              <h3 className="text-black font-semibold">
                Seller Contact:{" "}
                <span className="font-light capitalize text-wrap">
                  +91{item.seller.phone}{" "}
                  {/* using libphonenumber.js for formatting */}
                </span>
              </h3>
              <span className="text-[#546e88] font-semibold italic ">
                OTP:{" "}
                <span className="font-normal text-black text-sm">
                  {item.otp.buyer}
                </span>
              </span>
              {item.rentalDetails.totalDays ? (
                <span className="text-[#546e88] font-semibold italic ">
                  Duration:{" "}
                  <span className="font-normal text-black text-sm">
                    {item.rentalDetails.totalDays} Days
                  </span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Otp verify */}
          <div className="flex ">
            {item.status === "waiting-confirmation" ? (
              <div>
                <span className="text-[#546e88] font-semibold italic mr-8">
                  Waiting for Seller Confirmation
                </span>
              </div>
            ) : item.status === "exchange-verified" ? (
              <div>
                <span className="text-[#546e88] font-semibold italic mr-8">
                  Order Successfully Exchange
                </span>
              </div>
            ) : item.status === "deal-closed" ? (
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
        </div>
      ))}
    </div>
  );
}
