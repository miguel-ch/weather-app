import { memo } from "react";

const SearchBox = ({ action, refTarget }) => {
  return (
    <div className="flex-auto flex flex-row gap-3 text-lg">
      <div className="flex-auto">
        <input ref={refTarget} onKeyUp={action} className="p-3 rounded-xl min-w-0 w-full" type="text" placeholder="City name..."></input>
      </div>
      <button className="text-slate-200 bg-indigo-600 font-bold p-3 rounded-xl" onClick={action}>
        Search
      </button>
    </div>
  );
};

export default memo(SearchBox);
