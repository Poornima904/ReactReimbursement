import axios from "axios";

const baseURL = "ReimburseDestReact/";

const instance = axios.create({
  baseURL
});

export const getTableData = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/reimbursementheader", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getReimbursementItems = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/reimbursementitem", {
    params
  });

  return data.d?.results || data.d || data.value;
};

export const getWorkflowItems = async (params = { $top: 100, $skip: 0 }) => {
  const { data } = await instance.get("/workflow", {
    params
  });

  return data.d?.results || data.d || data.value;
};







export const getTableCount = async () => {
  const { data } = await instance.get("/reimbursementheader/$count");
  return data;
};
