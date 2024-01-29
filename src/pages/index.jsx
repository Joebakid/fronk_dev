/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/Layout";
import Cards from "@/components/Cards";
import { gsap } from "gsap";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { BsSortDownAlt } from "react-icons/bs";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 100;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dev-data.json");

        const jsonData = await response.json();

        // console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const renderData = () => {
    // const dataToRender = toggle ? toggleData : test;
    const filteredData = data?.filter((d) => {
      const nameMatch = searchTerm === "" || d.name.includes(`#${searchTerm}`);
      return nameMatch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    if (currentData && currentData.length > 0) {
      // setItemsAtTime(currentData)
      return currentData.map((d) => <Cards key={d.name} info={d} />);
    } else {
      return (
        <div className="text-center mt-20 text-xl">
          {currentData.length === 0 ? (
            "No results found."
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </div>
      );
    }
  };

  useEffect(() => {
    renderData();
  }, []);

  const renderPaginationButtons = () => {
    const totalPages = Math.ceil(data?.length / itemsPerPage);
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`${
            currentPage === i ? "bg-[#111]" : "bg-[#]"
          } border p-4 w-5 h-5 text-white justify-center items-center flex rounded-md`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  useEffect(() => {
    // Scroll to the top of the page when the page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const reveal = gsap.fromTo(
      "input, h2, .filter, .logo",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
        stagger: 0.1,
      }
    );
    return () => {
      reveal.kill();
    };
  }, []);

  return (
    <Layout title=".Devs" className={` bg-gray-500`}>
      <div className="container mx-auto ">
        <section>
          <div className="logo bg-blue-00 flex justify-center w-full md:mt-7 px-3  ">
            {/* <img
              src={`/assets/logo/fronkcartellogo2.png`}
              width={500}
              height={500}
              alt="logo"
              // priority
              className="w-full lg:w-2/3 h-full object-contain"
            /> */}{" "}
            <h1 className="text-7xl">.Devs</h1>
          </div>
          <div className="flex flex-col justify-center mt-5 items-center px-4 ">
            <h2 className="text-xl text-center mt-0 mb-5">Search by number</h2>
            <div className="w-full relative flex space-x-2">
              <input
                type="text"
                placeholder="Type Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute top-3 right-2 text-gray-700 ">
                <AiOutlineSearch size={28} />
              </div>
              {/* <div
                // onClick={showFilter}
                className="filter shadow-lg cursor-pointer flex justify-center items-center h-12 rounded-md bg-white text-primary w-12"
              >
                <FiFilter size={24} />
              </div>
              <div
                // onClick={toggleSortData}
                className="filter shadow-lg cursor-pointer flex justify-center items-center h-12 rounded-md bg-white text-primary w-12"
              >
                <BsSortDownAlt size={24} />
              </div> */}
            </div>
          </div>
        </section>

        <section className="pb-20">
          {data?.length > 0 ? (
            <>
              <div className="image-gallery mt-10">{renderData()}</div>
              <div>
                {/* <div className="flex items-center justify-between mt-14 mb-2 px-3">
                  <div className="arr"> &larr; </div>
                  <div> &rarr; </div>
                </div> */}
                <div className="flex justify-start items-center px-3 space-x-5 overflow-x-scroll pb-4 hide-scroll">
                  {/* {renderPaginationButtons()} */}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center mt-20 text-xl">
              {searchTerm ? (
                "No results found."
              ) : (
                <div className="animate-pulse">Loading...</div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
