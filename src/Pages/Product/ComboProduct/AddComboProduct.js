import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import Select from "react-select";
import { useGlobalState } from "../../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { getProductServ } from "../../../services/product.services";
import { addComboProductServ } from "../../../services/comboProduct.services";
import { getProductTypeServ } from "../../../services/productType.service";


function AddComboProduct() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const editor = useRef(null);
  const contentRef = useRef("");
  const config = { placeholder: "Start typing...", height: "300px" };

  const [content, setContent] = useState("");
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    productList: [],
    gtin: "",
    stockQuantity: "",
    price: "",
    discountedPrice: "",
    comboPrice: "",
    description: "",
    status: true,
  });

  const [productList, setProductList] = useState([]);

  const getProductListFunc = async () => {
    try {
      let response = await getProductServ();
      if (response?.data?.statusCode == "200") {
        setProductList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductListFunc();
  }, []);

  const handleProductSelect = (selectedOptions) => {
    const newProductList = selectedOptions.map((option) => {
      const existing = formData.productList.find((p) => p.productId === option.value);
      return existing || { productId: option.value, quantity: 1 };
    });
    setFormData({ ...formData, productList: newProductList });
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedList = formData.productList.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    );
    setFormData({ ...formData, productList: updatedList });
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const payload = {
        ...formData,
        description: contentRef.current,
      };
      let response = await addComboProductServ(payload);
      if (response?.data?.statusCode == 200) {
        toast.success(response?.data?.message);
        navigate("/update-combo-product-step2/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };
  useEffect(() => {
  const calculatePrices = () => {
    let totalPrice = 0;
    let totalDiscountedPrice = 0;

    formData.productList.forEach((item) => {
      const product = productList.find((p) => p._id === item.productId);
      if (product) {
        totalPrice += (product.price || 0) * item.quantity;
        totalDiscountedPrice += (product.discountedPrice || 0) * item.quantity;
      }
    });

    setFormData((prev) => ({
      ...prev,
      price: totalPrice.toFixed(2),
      discountedPrice: totalDiscountedPrice.toFixed(2),
    }));
  };

  calculatePrices();
}, [formData.productList, productList]);


  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Product Management" selectedItem="Add Combo Product" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2 ">
          <h4 className="p-2 text-dark shadow rounded mb-4" style={{ background: "#05E2B5" }}>
            Add Combo Product : Step 1/2
          </h4>

          <div className="row">
            {/* Combo Name */}
            <div className="col-4 mb-3">
              <label>Combo Name*</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>

            {/* GTIN */}
            <div className="col-4 mb-3">
              <label>GTIN Code*</label>
              <input
                className="form-control"
                style={{ height: "45px" }}
                value={formData.gtin}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) setFormData({ ...formData, gtin: value });
                }}
              />
            </div>

            {/* Stock Quantity */}
            <div className="col-4 mb-3">
              <label>Stock Quantity*</label>
              <input
                className="form-control"
                style={{ height: "45px" }}
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>

            
            <div className="col-6 border p-2  mb-3">
              <label>Products*</label>
              <Select
                isMulti
                options={productList.map((v) => ({ label: v.name, value: v._id }))}
                value={formData.productList.map((v) => {
                  const product = productList.find((p) => p._id === v.productId);
                  return { label: product?.name, value: v.productId };
                })}
                onChange={handleProductSelect}
              />
              {formData.productList.map((item, i) => {
              const product = productList.find((p) => p._id === item.productId);
              return (
                <div className=" mb-3" key={i}>
                  <label>{product?.name} Quantity*</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, Number(e.target.value))
                    }
                  />
                </div>
              );
            })}
            </div>

            {/* Product Quantities */}
            

            {/* Price */}
            <div className="col-6 border p-2 rounded mb-3">
              <label>Price*</label>
              <input
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-control"
                style={{ height: "45px" }}
              />
              {/* Discounted Price */}
            <div className=" mb-3">
              <label>Discounted Price*</label>
              <input
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>

            {/* Combo Price */}
            <div className=" mb-3">
              <label>Combo Price*</label>
              <input
                value={formData.comboPrice}
                onChange={(e) => setFormData({ ...formData, comboPrice: e.target.value })}
                className="form-control"
                style={{ height: "45px" }}
              />
            </div>
            </div>

            

            {/* Description */}
            <div className="col-12 mb-3">
              <label>Description*</label>
              <JoditEditor
                ref={editor}
                config={config}
                value={content}
                onChange={(newContent) => {
                  contentRef.current = newContent;
                }}
              />
            </div>

            {/* Submit */}
            <div className="col-12">
              <button
                className="btn btn-primary w-100"
                style={{
                  background: loader ? "#05E2B5" : "#61ce70",
                  border: "none",
                  borderRadius: "24px",
                  opacity: loader ? 0.6 : 1,
                }}
                onClick={!loader && handleSubmit}
              >
                {loader ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddComboProduct;

