import React from "react";
import Pagination from "@material-ui/lab/Pagination";
import {default_articles} from '../../utils/constants'
export default function MPagination({
  currentPage,
  articles_total,
  onChangePage,
}) {
  return (
    <div>
      <Pagination
        shape={"rounded"}
        size={"small"}
        page={currentPage}
        onChange={(data, page) => onChangePage(page)}
        count={Math.ceil(articles_total / default_articles)}
      />
    </div>
  );
}
