import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../Components/Sidebar";
import TopNav from "../../../Components/TopNav";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import JoditEditor from "jodit-react";

import { useParams, useNavigate } from "react-router-dom";
import {
  getComboProductDetailsServ,
  updateComboProductServ,
} from "../../../services/comboProduct.services";
function ComboProductUpdateStep2() {
  const params = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [_id, setId] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const contentRef = useRef(""); // ✅ Store content without causing re-renders
  const [showPackServingWarning, setShowPackServingWarning] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false); // for "Yes/No" control

  // Jodit Editor Config
  const config = {
    placeholder: "Start typing...",
    height: "400px",
  };
  const [formData, setFormData] = useState({
    stockQuantity: "",

    pricing: {
      actualPrice: "",
      offerPrice: "",
      currency: "INR",
    },

    weight: {
      itemWeight: "",
      packageWeight: "",
    },

    longDescription: "",
  });

  const getProductDetails = async () => {
    try {
      let response = await getComboProductDetailsServ(params?.id);
      if (response?.data?.statusCode === 200) {
        const product = response?.data?.data;
        setFormData({
          stockQuantity: product?.stockQuantity || "",
          pricing: {
            actualPrice: product?.pricing?.actualPrice || "",
            offerPrice: product?.pricing?.offerPrice || "",
            currency: product?.pricing?.currency || "INR",
          },

          weight: {
            itemWeight: product?.weight?.itemWeight || "",
            packageWeight: product?.weight?.packageWeight || "",
          },

          longDescription: product?.longDescription || "",
        });
        setContent(product?.longDescription || "");
        contentRef.current = product?.longDescription || "";
      }
    } catch (error) {
      toast.error("Failed to fetch product details.");
    }
  };

  useEffect(() => {
    // getBrandList();
    getProductDetails();
  }, []);

  const updateProductFunc = async () => {
    setBtnLoader(true);
    try {
      let updatedData = {
        ...formData,
        longDescription: contentRef.current,
        id: params?.id,
      };
      let response = await updateComboProductServ(updatedData);
      if (response?.data?.statusCode == "200") {
        toast.success("Combo Product Step 2 Updated Successfully!");
        setFormData({
          stockQuantity: "",

          pricing: {
            actualPrice: "",
            offerPrice: "",
            currency: "INR",
          },

          weight: {
            itemWeight: "",
            packageWeight: "",
          },

          longDescription: "",
        });
        navigate("/update-combo-product-step3/" + response?.data?.data?._id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setBtnLoader(false);
  };
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
                    Update Combo Product : Step 2/3
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-4 mb-3">
                  <label>Stock Quantity</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: e?.target.value,
                      })
                    }
                    value={formData?.stockQuantity}
                    className="form-control"
                  />
                </div>

                <div className="col-4 mb-3">
                  <label>Item Weight</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: {
                          ...formData.weight,
                          itemWeight: e.target.value,
                        },
                      })
                    }
                    value={formData?.weight?.itemWeight || ""}
                    className="form-control"
                  />
                </div>
                <div className="col-4 mb-3">
                  <label>Package Weight</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: {
                          ...formData.weight,
                          packageWeight: e.target.value,
                        },
                      })
                    }
                    value={formData?.weight?.packageWeight || ""}
                    className="form-control"
                  />
                </div>
                <hr />
                <div className="col-12 d-flex ">
                  <p className="py-1 px-3 me-2 bg-primary text-light rounded bedge">
                    INR
                  </p>
                  <p
                    className="py-1 px-3 me-2 bg-secondary text-light rounded bedge"
                    style={{ cursor: "pointer" }}
                    onClick={() => alert("Comming Soon")}
                  >
                    USD
                  </p>
                  <p
                    className="py-1 px-3 me-2 bg-secondary text-light rounded bedge"
                    style={{ cursor: "pointer" }}
                    onClick={() => alert("Comming Soon")}
                  >
                    AED
                  </p>
                </div>

                <div className="col-6 mb-3">
                  <label>Product Price (MRP)</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          actualPrice: e.target.value,
                        },
                      })
                    }
                    value={formData?.pricing?.actualPrice || ""}
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Discounted/Sale Price</label>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          offerPrice: e.target.value,
                        },
                      })
                    }
                    value={formData?.pricing?.offerPrice || ""}
                    className="form-control"
                  />
                </div>
                <div className="col-12 mb-3">
                  <label>Product Description</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={content}
                    onChange={(newContent) => {
                      contentRef.current = newContent; // ✅ Update ref without re-rendering
                    }}
                  />
                </div>
                {btnLoader ? (
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
                      Updating ...
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
                      onClick={() => updateProductFunc()}
                      disabled={showPackServingWarning && !proceedAnyway} // Disable until confirmed
                    >
                      Update
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

export default ComboProductUpdateStep2;
