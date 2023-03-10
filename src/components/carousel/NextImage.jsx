import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Image from "./Image";

export default function NextImage({ isTextAni, slider, isBtnClicked }) {
  return <Image num={1} slider={slider} isBtnClicked={isBtnClicked} />;
}
