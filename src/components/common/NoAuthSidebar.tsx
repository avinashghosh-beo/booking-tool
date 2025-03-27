import React from "react";
import { StarIcon } from "../icons";
import { useTranslation } from "react-i18next";
import logo from "../../assets/Icons/logo.svg";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface Testimonial {
  text: string;
  author: string;
  avatar: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    title: "Sample Title",
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    author: "Emma Jackson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    title: "Sample Title",
    text: "The printing and typesetting industry has been revolutionized by this service.",
    author: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    title: "Sample Title",
    text: "An exceptional platform that offers a unique experience for job seekers.",
    author: "Sophia Williams",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
];

export const NoAuthSidebar = () => {
  const { t } = useTranslation();
  return (
    <div
      aria-label={t("ariaLabels.leftSideSidebar")}
      className="hidden md:flex md:w-full md:max-w-96 lg:max-w-[30rem] bg-primary-900 text-white p-8 flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-12">
          <img
            aria-label={t("ariaLabels.personalturmLogo")}
            src={logo}
            alt="Logo"
            className="max-w-64"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-medium lg:text-4xl">
            {t("shortStrings.sidebarTitle")}
          </h2>
          <p className="text-white">{t("shortStrings.sidebarSubTitle")}</p>
        </div>
      </div>
      {/* Testimonial Section */}
      <div className="mt-6" aria-label={t("ariaLabels.testimonials")}>
        <Swiper
          modules={[Navigation, Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col justify-start p-5 bg-primary-950 rounded-2xl">
                <div className="flex flex-row justify-between pb-4">
                  <p className="text-light">{testimonial.title}</p>
                  <div className="flex flex-row gap-1">
                    {Array(5)
                      .fill("")
                      .map((_, key) => (
                        <StarIcon key={key} />
                      ))}
                  </div>
                </div>
                <div>
                  <p className="mb-4 italic text-primary-100">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex flex-row items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 mr-4 rounded-full"
                  />
                  <div className="font-medium">{testimonial.author}</div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NoAuthSidebar;
