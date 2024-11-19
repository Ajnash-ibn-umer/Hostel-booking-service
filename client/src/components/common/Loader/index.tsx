const Loader = () => {
  return (
    <div
      style={{ zIndex: 100 }}
      className="z-100 fixed bottom-0 left-0 right-0 top-0 flex items-center  justify-center "
    >
      <div className="left-50% top-50% h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Loader;
