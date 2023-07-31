import { useInfiniteQuery } from "react-query";
import fetchData from "@/utils/fetchData";
import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery("password", fetchData, {
      getNextPageParam: (lastPage, pages) => lastPage.offset,
    });

  const flattenedData = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.results) : []),
    [data]
  );

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      //Return if already fetching
      if (isLoading || isFetching) return;

      // Disconnect if already observer exists
      if (observer.current) observer.current.disconnect();

      //Create new observer for the last element, and call fetchNextPage if visible(isIntersecting)
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage]
  );

  if (isLoading) return <h1>Loading Data</h1>;

  if (error) return <h1>Couldn't fetch data</h1>;

  return (
    <main>
      <Link href="youtube.com/@DeveloperALMO">
        <h1 className="text-center">youtube.com/@DeveloperALMO</h1>
      </Link>
      <hr style={{ borderColor: "darkgreen" }} className="mt-2 mb-6" />
      <div>
        {flattenedData.map((item, i) => (
          <div
            key={i}
            ref={flattenedData.length === i + 1 ? lastElementRef : null}
          >
            <p className="text-center">
              {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            </p>
          </div>
        ))}
      </div>
      {isFetching && <p>Fetching more data</p>}

      <br />
      <br />
      <br />
      <p>
        An adaptation to NextJS of:&nbsp;
        <Link
          style={{ color: "blue" }}
          href="https://www.antstack.com/blog/implementing-infinite-scroll-pagination-with-react-query-v3/"
        >
          Implementing Infinite Scroll Pagination with React-Query v3
        </Link>
      </p>
    </main>
  );
}
