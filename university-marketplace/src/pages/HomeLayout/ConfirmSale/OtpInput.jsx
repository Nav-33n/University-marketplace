import { useRef, useState } from "react";
import API from "../../../services/api";

const OtpInput = ({ orderId, expired, userToken }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpExpiry, setOtpExpiry] = useState(new Date(expired));
  const [hasRegenerated, setHasRegenerated] = useState(false);
  const inputsRef = useRef([]);

  const expiredDate = new Date(expired);
  const now = new Date();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    try {
      const res = await API.post(
        `/orders/verify-otp/${orderId}`,
        { otp: finalOtp },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      alert("congratulations! OTP verified successfully.");
    } catch (err) {
      alert("OTP verification failed: ", err.response?.data?.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await API.post(
        `/orders/verify-otp/${orderId}`,
        { otp: "" },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      alert(res.data.message);
      console.log(res.data);
      if (res.data.otp.ExpiresAt) {
        setOtpExpiry(new Date(res.data.otp.ExpiresAt));
      }
      setHasRegenerated(true);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col  justify-center items-center gap-4">
      {/* OTP Boxes */}
      <div className="flex gap-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-8 h-10 text-center border-2 border-[#f8f8f8] rounded-md text-xl focus:outline-none focus:border-[#000000]"
          />
        ))}
      </div>

      {/* Submit Button */}
      {now > expiredDate ? (
        <div className="justify-center flex flex-col items-center">
          <button
            onClick={handleVerify}
            disabled={true}
            className="bg-[#00000058] w-[100px] text-white justify-center flex px-6 py-2 text-sm rounded-xl transition"
          >
            Expired
          </button>
          {!hasRegenerated && (
            <p
              onClick={handleResendOtp}
              className="flex mt-1 text-blue-500 underline cursor-pointer hover:text-blue-700"
            >
              Resend OTP (1 day validity)
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={handleVerify}
          className="bg-[#000000] text-white px-6 py-2 text-sm rounded-xl hover:bg-[#00000058] transition"
        >
          Verify
        </button>
      )}
    </div>
  );
};

export default OtpInput;
