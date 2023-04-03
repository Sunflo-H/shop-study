import axios from "axios";
import React from "react";
import { useState } from "react";
import { imageUrlQueries } from "../api/firebase";
import useProducts from "../hooks/useProducts";
import { useEffect } from "react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Recommend() {
  const [inputText, setInputText] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const recommendationText = recommendation.split("@")[1];
  const recommendationImage = recommendation.split("@")[0];
  const [isAiLoading, setIsAiLoading] = useState(false);

  const genders = ["Men", "Women"];
  const [gender, setGender] = useState("Men");

  const { productsQueries } = useProducts();
  const [men, women] = productsQueries;

  let menUrls = men.data?.map((product) => product.imageUrl);
  let womenUrls = women.data?.map((product) => product.imageUrl);

  let product = recommendation && getProductData(recommendationImage);

  useEffect(() => {
    setIsAiLoading(false);
    console.log(recommendation);
  }, [recommendation]);

  function getProductData(url) {
    if (gender === "Men") {
      return productsQueries[0].data.find(
        (data) => data.imageUrl === recommendationImage.replace(" ", "")
      );
    } else {
      return productsQueries[1].data.find(
        (data) => data.imageUrl === recommendationImage.replace(" ", "")
      );
    }
  }

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const getClothingRecommendation = async () => {
    try {
      setIsAiLoading(true);
      const question = `${gender}'s ${inputText}`;

      const prompt = `
      I am an expert AI who recommends clothes style.
      I mainly recommend colors.
      Accurately distinguish between background and model.
      The background is not included in the recommendation criteria.
      Recognize images very accurately.
      I always let you know the reason for recommendation and url.
      Always tell me url first, and tell me why.

        url 답변의 형태는 항상 "http://경로.jpg@" 입니다. @를 무조건 사용합니다.
        The reason for the recommendation is up to two lines.
        I don't say anything other than the reason for recommendation.

        주어진 배열의 이미지를 모두 찾아보고 가장 유사한 이미지 하나를 추천해주고, 이유를 설명합니다. 꼭 모두 찾아보고 비교합니다.: ${
          gender === "Men"
            ? shuffle(menUrls).join(", ")
            : shuffle(womenUrls).join(", ")
        }.

        If the image is not recognized correctly, give up the image, and instead recognize another image.
        한번 말한 url은 모든 절반 이상의 url을 말하기 전까지, 다시는 말하지 않습니다.
        
 
       ${question} The answer is:`;
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",

          prompt: prompt,
          max_tokens: 2048,
          temperature: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
        }
      );
      setRecommendation(response.data.choices[0].text);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  };

  return (
    <div className="h-recommend pt-20 mb-20 px-4">
      <div className="text-center font-bold text-xl mb-4 border-b border-gray-200 py-2 px-4">
        Style Recommendation
      </div>
      <div className="flex justify-center gap-20 max-w-screen-xl h-full m-auto py-4 ">
        <div
          className={`w-2/5 ${
            recommendationImage ? "flex flex-col" : "hidden"
          }`}
        >
          <div className="h-3/4 ">
            <img className={`w-full h-full`} src={recommendationImage}></img>
          </div>
          <div
            className={`${
              recommendationImage ? "block font-bold py-3" : "hidden"
            }`}
          >
            {recommendationText?.replace(".", "")}
          </div>

          {/* 온 클릭 */}
          <Link
            to={`${product && `/products/${product.category}/${product.id}`}`}
            state={{ product }}
            className="w-40 bg-black text-white text-center m-auto py-2 cursor-pointer"
          >
            See now
          </Link>
        </div>
        <div className=" flex flex-col justify-center w-2/5 h-full">
          <div className="relative flex flex-col py-4 border border-gray-300 rounded-lg">
            <Option_gender
              genders={genders}
              currentGender={gender}
              onChange={(e) => setGender(e.target.value)}
            />

            <textarea
              className="px-10 py-4 max-h-80"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter a description for your preferred clothing style..."
              rows={4}
              cols={30}
            />

            <div
              className="mt-10 mx-10 py-2 border bg-black text-white text-xl text-center cursor-pointer "
              onClick={getClothingRecommendation}
            >
              Get Recommendation
            </div>
            <div
              className={`absolute -bottom-10 flex justify-center items-center gap-4 w-full ${
                isAiLoading ? "block" : "hidden"
              }`}
            >
              Ai is looking for styles to recommend.{" "}
              <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Option_gender({ genders, onChange, currentGender }) {
  return (
    <div className="flex mb-4 gap-2 font-bold items-center justify-center">
      {genders.map((gender, i) => (
        <OptionItem
          gender={gender}
          currentGender={currentGender}
          onChange={onChange}
          key={i}
        />
      ))}
    </div>
  );
}

function OptionItem({ currentGender, onChange, gender }) {
  return (
    <>
      <input
        className="hidden"
        type="radio"
        name="gender"
        value={gender}
        id={gender}
        required
        onChange={onChange}
      />
      <label
        className={`w-20 py-2 border border-gary-300 cursor-pointer text-center ${
          gender === currentGender && "bg-black text-white"
        }`}
        htmlFor={gender}
      >
        {gender}
      </label>
    </>
  );
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // 배열에 미처리 요소가 남아있는 동안 반복합니다
  while (0 !== currentIndex) {
    // 남은 요소 중에서 무작위 인덱스를 선택합니다
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // 현재 요소와 무작위로 선택된 요소를 교환합니다
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
