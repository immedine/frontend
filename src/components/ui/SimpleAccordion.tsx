
export default function SimpleAccordion({
    contentChildren,
    topBar,
    open
}) {

  return (
    <div className="">
      {topBar}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-40" : "max-h-0"
        }`}
      >
        {contentChildren}
      </div>
    </div>
  );
}

