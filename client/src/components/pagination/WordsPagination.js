import React from "react";
import Pagination from "@material-ui/lab/Pagination";
import {default_words} from '../../utils/constants'
export default function WordsPagination({
  currentPage,
  words_total,
  onChangePage,
}) {
  return (
    <div>
      <Pagination
        shape={"rounded"}
        size={"small"}
        page={currentPage}
        onChange={(data, page) => onChangePage(page)}
        count={Math.ceil(words_total / default_words)}
      />
    </div>
  );
}
