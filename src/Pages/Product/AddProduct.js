import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { getTagSetServ } from "../../services/tag.service";
import { getProductTypeServ } from "../../services/productType.service";
import { getTaxServ } from "../../services/tax.service";
import { addProductServ } from "../../services/product.services";
import Select from "react-select";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { getCategoryServ } from "../../services/category.service";
import { getVenderListServ } from "../../services/vender.services";
function AddProduct() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const editor = useRef(null);
  const contentRef = useRef("");
  const config = {
    placeholder: "Start typing...",
    height: "300px",
  };
  const [hsnError, setHsnError] = useState("");

  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    tags: [],
    productType: "",
    tax: "",
    categoryId: "",
    venderId:"",
    hsnCode: "",
    GTIN: "",
    shortDescription: "",
    productApperence:"",
    barCode:"",
  });
  const [tags, setTags] = useState([]);
  const getTagListFunc = async () => {
    try {
      let response = await getTagSetServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setTags(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [productType, setProductType] = useState([]);
  const getProductListFunc = async () => {
    try {
      let response = await getProductTypeServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setProductType(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [taxList, setTaxList] = useState([]);
  const getTaxListFunc = async () => {
    try {
      let response = await getTaxServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setTaxList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [categoryList, setCategoryList] = useState([]);
  const getCategoryListFunc = async () => {
    try {
      let response = await getCategoryServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setCategoryList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [venderList, setVenderList] = useState([]);
  const getVenderListFunc = async () => {
    try {
      let response = await getVenderListServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setVenderList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTagListFunc();
    getProductListFunc();
    getTaxListFunc();
    getCategoryListFunc();
    getVenderListFunc();
  }, []);
  const [loader, setLoader] = useState(false);
  const handleSubmit = async () => {
    setLoader(true);
    try {
      let finalPayload;
      const shortDescription = contentRef.current;
      if (formData?.createdByAdmin != "No") {
        finalPayload = {
          name: formData?.name,
          tags: formData?.tags,
          productType: formData?.productType,
          tax: formData?.tax,
          categoryId: formData?.categoryId,
          venderId: formData?.venderId,
          hsnCode: formData?.hsnCode,
          GTIN: formData?.GTIN,
          shortDescription: shortDescription,
          productApperence:formData?.productApperence,
          barCode:formData?.barCode,
        };
      }
      if (formData?.createdByAdmin == "No") {
        finalPayload = {
          name: formData?.name,
          tags: formData?.tags,
          productType: formData?.productType,
          tax: formData?.tax,
          categoryId: formData?.categoryId,
          venderId: formData?.venderId,
          madeIn: formData?.madeIn,
          hsnCode: formData?.hsnCode,
          
          shortDescription: shortDescription,
          createdBy: formData?.createdBy,
          productApperence: formData?.productApperence,
          barCode: formData?.barCode
        };
      }
      let response = await addProductServ(finalPayload);
      if (response?.data?.statusCode == 200) {
        toast.success(response?.data?.message);
        setFormData({
          name: "",
          tags: [],
          productType: "",
          tax: "",
          categoryId: "",
          venderId: "",
          madeIn: "",
          hsnCode: "",
          
          createdBy: "",
          createdByAdmin: "",
          productApperence:"",
          barCode:""
        });
        contentRef.current = "";
        setContent("");
        navigate("/update-product-step2/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };
const [vendorList, setVendorList]=useState([]);
  const getVendorListFunc =async ()=>{
    try {
      let response = await getVenderListServ({});
      if(response?.data?.statusCode=="200"){
        setVendorList(response?.data?.data)
      }
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    getVendorListFunc()
  }, [])
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div
            className="row mx-0 p-0"
            style={{
              position: "relative",
              top: "-75px",
              marginBottom: "-75px",
            }}
          ></div>

          <div className="mt-3">
            <div className="card-body px-2">
              <div className="table-responsive table-invoice">
                <div className="d-flex">
                  <h4
                    className="p-2 text-dark shadow rounded mb-4 "
                    style={{ background: "#05E2B5" }}
                  >
                    Add Product : Step 1/4
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label>Product Name*</label>
                  <input
                    value={formData?.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e?.target?.value })
                    }
                    className="form-control"
                    style={{ height: "45px" }}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Tags</label>
                  <Select
                    isMulti
                    options={tags?.map((v) => ({
                      label: v?.name,
                      value: v?._id,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        tags: selectedOptions.map((option) => option.label), // only array of string IDs
                      })
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Select Product Type</label>
                  <select
                    className="form-control"
                    value={formData?.productType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productType: e?.target?.value,
                      })
                    }
                  >
                    <option>Select</option>
                    {productType?.map((v, i) => {
                      return <option>{v?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Select Tax*</label>
                  <select
                    className="form-control"
                    value={formData?.tax}
                    onChange={(e) =>
                      setFormData({ ...formData, tax: e?.target?.value })
                    }
                  >
                    <option>Select</option>
                    {taxList?.map((v, i) => {
                      return (
                        <option>
                          {v?.name + "" + (v?.percentage + " %")}{" "}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-6 mb-3">
                  <label>Category*</label>
                  <Select
                    isMulti
                    options={categoryList?.map((v) => ({
                      label: v?.name,
                      value: v?._id,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        categoryId: selectedOptions.map((option) => option.value),
                      })
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Vender*</label>
                  <Select
                    isMulti
                    options={vendorList?.map((v) => ({
                      label: v?.firstName,
                      value: v?._id,
                    }))}
                    onChange={(selectedOptions) =>
                      setFormData({
                        ...formData,
                        venderId: selectedOptions.map((option) => option.value),
                      })
                    }
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>HSN Code*</label>
                  <input
                    className={`form-control ${hsnError ? "is-invalid" : ""}`}
                    style={{ height: "45px" }}
                    value={formData?.hsnCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setFormData({ ...formData, hsnCode: value });
                        setHsnError("");
                      } else {
                        setHsnError("Only numbers are allowed in HSN Code");
                      }
                    }}
                  />
                  {hsnError && (
                    <div className="invalid-feedback">{hsnError}</div>
                  )}
                </div>
                <div className="col-6 mb-3">
                  <label>Bar Code*</label>
                  <input
                    className={`form-control `}
                    style={{ height: "45px" }}
                    type="number"
                    value={formData?.barCode}
                    onChange={(e) => {
                       setFormData({ ...formData, barCode: e?.target?.value })
                      
                    }}
                  />
                  
                </div>

                <div className="col-12 mb-3">
                  <label>Special Apperence</label>
                  <select onChange={(e)=>setFormData({...formData, productApperence:e?.target?.value})} className="form-control">
                    <option>Select</option>
                    <option>Popular</option>
                    <option>Best Seller</option>
                  </select>
                 
                </div>

                <div className="col-12 mb-3">
                  <label>Short Description*</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent;
                    }}
                  />
                </div>
                {loader ? (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                        opacity: "0.6",
                      }}
                    >
                      Saving ...
                    </button>
                  </div>
                ) : formData?.name &&
                  formData?.tags?.length > 0 &&
                  formData?.hsnCode ? (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#05E2B5",
                        border: "none",
                        borderRadius: "24px",
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        background: "#61ce70",
                        border: "none",
                        borderRadius: "24px",
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
