import React, { useEffect, useState } from "react";
// import Navbar from "../header/navbar";
// import Backgound from "../background/backgound";
import { HiArrowNarrowRight } from "react-icons/hi";
import InputEmail from "../input/InputEmail";
import InputPass from "../input/InputPass";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { selectLoginData } from "../../redux/loginSlice";
import axios from "axios";
import Cookies from 'universal-cookie';
import { useRouter } from "next/router";



function LoginAdmin() {
  const cookie = new Cookies();
  const router = useRouter()

  const [Loading, setLoading] = useState(false);
  const [Success, setSuccess] = useState(false);
  const [GagalText, setGagalText] = useState("");

  const dataLogin = useSelector(selectLoginData);

  const renderButtonMasuk = () => {
    return Success ? (
      <div className="flex gap-3 select-none justify-center items-center px-6 py-2 bg-red-300 rounded-lg h-10 w-28">
        <p className="font-bold text-red-50">Redirecting</p>
      </div>
    ) : Loading ? (
      <div className="flex gap-3 select-none justify-center items-center px-6 py-2 bg-red-300 rounded-lg h-10 w-28 text-white">
        Loading
        <ClipLoader size={23} color="white" />
      </div>
    ) : (
      <button
        onClick={handleMasuk}
        className="inline-flex items-center px-6 py-2 bg-red-500 rounded-lg h-10 w-28 text-white"
      >
        Masuk
        <div className="px-2 pt-1">
          <HiArrowNarrowRight />
        </div>
      </button>
    );
  };

  const handleMasuk = (e) => {
    e.preventDefault();
    setGagalText("");
    setLoading(true);
    const { email, password } = dataLogin;
    if (email.replace(/\s+/g, "") == "" || password.replace(/\s+/g, "") == "") {
      alert("Email dan Password harus diisi");
      return;
    }
    var bodyFormData = new FormData();
    bodyFormData.append("email", email);
    bodyFormData.append("password", password);
    axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/login`,
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        // Ini setting UI by Kae
        setSuccess(true);
        let token = response.data.data.token
        cookie.set("token_admin", token)

        // do some logic here if success (200 OK)
        // routing here
      })
      .catch(function (err) {
        // do some logic if not (200 OK)
        var res = err.response.data;
        setGagalText(res.message);
        setLoading(false);
      });
  };

  return (
    <div className="">
      <div className={"z-50"}>
        <div className="md:grid md:grid-cols-2 gap-4 place-items-center py-28 px-5">
          <div className="hidden md:block">
            <img className="" src="ilus-antri01.svg"></img>
          </div>
          <div className="px-10 pt-11 md:h-full sm:h-screen">
            <span className="text-2xl font-bold">Sign In</span>
            <form className="py-4">
              <InputEmail />
              <InputPass />
              {GagalText != "" && (
                <div className="bg-red-50 mt-2 p-3 rounded-lg">
                  <p className="text-center text-sm text-red-700 font-bold">
                    {GagalText}
                  </p>
                  <p className="text-center text-sm text-red-400">
                    Please Contact Admin If You're Not Sure
                  </p>
                </div>
              )}
              <div className="flex justify-between py-4">
                {renderButtonMasuk()}
                {Success ? (
                  <div
                    href="/create-account"
                    className="bg-red-50 rounded-lg h-10 w-28 border-2 border-red-50 pt-1.5"
                  >
                    <p className="text-red-200 font-semibold text-center ">
                      Daftar
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push("/create-account")}
                    className="flex flex-col items-center justify-center bg-red-50 rounded-lg h-10 w-28 border-2 border-red-300 text-red-600 font-semibold text-center"
                  >
                    <p>
                    Daftar
                    </p>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
