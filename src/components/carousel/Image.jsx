import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function Image({ num, slider, isBtnClicked }) {
  const navigate = useNavigate();
  const [isAni, setIsAni] = useState(false); //false -> true가 되면서 이미지가 움직여, true인 상태를 유지

  // 슬라이드 내부 컨텐츠에 적용된 애니메이션이 부드럽게 작동되기 위해 PrevImage, NextImage일때는 slider의 값을 바꿔준다.
  if (slider === 4) slider = 1;
  if (slider === 0) slider = 3;

  useEffect(() => {}, []);

  useEffect(() => {
    setIsAni(false); //true
    setTimeout(() => {
      setIsAni(true);
    }, 500);
  }, [isBtnClicked]);

  return (
    <section className="w-section relative transition-all mb-20  ">
      <div className=" max-w-screen md:max-w-banner max-h-screen md:max-h-banner bg-white overflow-hidden ">
        <div
          className={`w-screen h-screen md:w-banner md:h-banner bg-cover bg-no-repeat banner${num} bg-left40 lg:bg-left 
          ${num !== slider && "animate-hide"}
          ${num === slider && "opacity-70"}
          ${isAni && "animate-banner-img-sm xl:animate-banner-img "}
                  `}
        ></div>
      </div>
      <div className="absolute top-48 md:top-64  left-10 xl:left-auto md:right-14 ">
        <h2
          className={` text-5xl md:text-6xl  lg:text-7xl xl:text-8xl font-bold mb-10 text-zinc-900 
          translate-x-10
          ${num !== slider && "animate-hide"}
          ${num === slider && "opacity-0"}
            ${isAni && num === slider && "animate-banner-text"}
            
        `}
        >
          Discover
          <br />
          your new styles
        </h2>

        <Button
          text={"Shop Now"}
          onClick={() => navigate("/products")}
          isAni={isAni}
          num={num}
          slider={slider}
        />
      </div>
    </section>
  );
}
