import React from "react";
import Image from "next/image";
import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { ItemResponseWithTrans } from "../../lib/mutations/itemMutations";
import { formatDateTime } from "../../lib/formatDateTime";
import { formatRupiah } from "../../lib/formatCurrency";
import { formatSlug } from "../../lib/formatString";
import { ImageResponse } from "../../lib/mutations/imageMutations";
import { rgbDataURL } from "../../lib/formatImage";
import { IMAGE_URL } from "../../lib/url";

interface ProductProps {
  data: ItemResponseWithTrans;
  images: ImageResponse[];
}

const placeholderImg = "/uploads/item_placeholder.png";

const Product = ({ data, images }: ProductProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/lelang-terbuka/${formatSlug(data.name, data.id)}`);
  };

  const highestTrans = data.transactions ? [...data.transactions] : [];
  highestTrans.sort((a, b) => {
    if (a.bid_value < b.bid_value) return 1;
    if (a.bid_value > b.bid_value) return -1;
    else return 0;
  });

  const img = images.length > 0 ? IMAGE_URL + "/w_400" + images[0].link : "";
  return (
    <div className="transition duration-150 ease-in-out border border-gray-300 rounded-xl group hover:border-primary-l hover:bg-gray-50 hover:shadow-md">
      <figure className="border-b border-gray-300 cursor-pointer rounded-t-xl">
        <Image
          className="rounded-t-xl"
          onClick={onClick}
          src={images.length ? img : placeholderImg}
          alt="placeholderImage"
          height="400"
          width="400"
          objectFit="cover"
          layout="responsive"
          placeholder="blur"
          blurDataURL={rgbDataURL(220, 220, 220)}
        />
      </figure>

      <div className="px-4 pb-4">
        <h2
          onClick={onClick}
          className="mt-4 font-bold cursor-pointer hover:underline"
        >
          {data.name}
        </h2>
        <div className="flex flex-row items-center justify-start gap-2 mt-2 mb-4 text-danger-d">
          <ClockIcon className="w-4 h-4 font-semibold" />
          <p className="text-sm font-semibold">
            {formatDateTime(data.closing_time)}
          </p>
        </div>

        <div className="flex flex-col items-start justify-between w-full gap-2 text-sm">
          <div className="flex flex-row items-start justify-between w-full gap-4">
            <p>Dibuka</p>
            <h4>{formatRupiah(data.open_bid)}</h4>
          </div>
          <div className="flex flex-row items-start justify-between w-full gap-4">
            <p>Tertinggi</p>
            <h4 className="text-base font-semibold">
              {highestTrans.length > 0
                ? formatRupiah(highestTrans[0]?.bid_value)
                : "-"}
            </h4>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 mt-4">
          <LocationMarkerIcon className="w-5 h-5" />
          <h4 className="text-base font-semibold">{data.location}</h4>
        </div>
      </div>
    </div>
  );
};

export default Product;
