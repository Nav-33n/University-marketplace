import API from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Pencil } from "lucide-react";
import ProductEditor from "./ProductEditor";
import { useState } from "react";
import ProductDelete from "./ProductDelete";

export default function UserProducts({ userToken }) {
  const [showLayout, setLayout] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const [selectedItem, SetSelectedItem] = useState(null);

  const {
    data: myItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myproduct"],
    queryFn: async () => {
      const res = await API.get("/items/myproduct", {
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
  if (!myItems || myItems.length === 0)
    return <p className="p-4 text-red-500">Nothing listed for sale.</p>;

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {myItems.map((item, index) => (
        <div
          key={index}
          className="bg-cyan-200 w-full flex py-4 rounded-xl justify-between mb-4"
        >
          {/* Image Section */}
          <div className="flex w-40 h-40  ml-4 justify-center items-center rounded-2xl bg-amber-200">
            <img
              src={item.imageUrls[0]}
              alt="Main Product"
              className=" w-38 h-38 object-cover rounded-xl"
            />
          </div>

          {/* Description Section */}
          <div className="flex flex-col w-[300px] sm:w-[900px] pl-5">
            <span className="text-[#546e88] font-semibold italic">
              Title:{" "}
              <span className="font-normal text-[#010101c8] uppercase">
                {item.title}
              </span>{" "}
            </span>
            <span className="text-[#546e88] font-semibold italic line-clamp-1">
              Description:{" "}
              <span className="font-normal text-black text-sm  text-pretty">
                {item.description}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Price:{" "}
              <span className="font-normal text-black text-sm">
                ₹{item.price}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Type:{" "}
              <span className="font-normal text-black text-sm">
                {item.type}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Category:{" "}
              <span className="font-normal text-black text-sm">
                {item.category}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Status:{" "}
              <span className="font-normal text-black text-sm">
                {item.sold ? "Sold" : "Listed"}
              </span>
            </span>
            <span className="text-[#546e88] font-semibold italic ">
              Published:{" "}
              <span className="font-normal text-black text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </span>
          </div>

          {/* Edit and Delete Button */}
          <div className="flex flex-col justify-center items-center mr-10">
            <Trash2
              size={20}
              className="text-black my-2 hover:text-white cursor-pointer"
              onClick={() => {
                setDelete(true);
                SetSelectedItem(item);
              }}
            />
            <Pencil
              size={20}
              className="text-black my-2 hover:text-white cursor-pointer"
              onClick={() => {
                SetSelectedItem(item);
                setLayout(true);
              }}
            />
          </div>
        </div>
      ))}

      {showLayout && selectedItem && (
        <ProductEditor
          userToken={userToken}
          item={selectedItem}
          onClose={() => setLayout(false)}
        />
      )}

      {isDelete && (
        <ProductDelete
          id={selectedItem._id}
          userToken={userToken}
          onClose={() => setDelete(false)}
        />
      )}
    </div>
  );
}
