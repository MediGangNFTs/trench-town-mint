"use client";
import Connect from "../components/Connect";
import Mint from "../components/Mint";

export default function Page() {
  return (
    <div style={{padding:40,fontFamily:"sans-serif"}}>
      <h1>Trench Town Mint</h1>
      <Connect/>
      <Mint/>
    </div>
  );
}
