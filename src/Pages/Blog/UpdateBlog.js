import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import {
  updateBlogServ,
  getBlogDetailsServ,
} from "../../services/blog.service";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBlog() {
  const navigate = useNavigate();
  const params = useParams();
  const editor = useRef(null);

  const config = {
    placeholder: "Start typing...",
    height: "300px",
  };

  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    seoTitle: "",
    metaKeyword: "",
    metaDescription: "",
    rank: "",
    tags: "",
    status:""
  });

  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    setLoader(true);
    try {
      let finalPayload = {
        ...formData,
        shortDescription: shortDescription,
        description: description,
        id: params?.id,
      };
      let response = await updateBlogServ(finalPayload);
      if (response?.data?.statusCode == "200") {
        toast.success("Blog saved successfully!");
        navigate("/blogs-list");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
    setLoader(false);
  };

  const isFormValid =
    formData.title &&
    formData.rank &&
    formData.rank &&
    formData.tags.length > 0 &&
    shortDescription;
  const getBlogDetailsFunc = async () => {
    try {
      let response = await getBlogDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setFormData({
          imgPrev: response?.data?.data?.image,
          title: response?.data?.data?.title,
          seoTitle: response?.data?.data?.seoTitle,
          metaKeyword: response?.data?.data?.metaKeyword,
          metaDescription: response?.data?.data?.metaDescription,
          rank: response?.data?.data?.rank,
          tags: response?.data?.data?.tags,
          status:response?.data?.data?.status
        });
        setShortDescription(response?.data?.data?.shortDescription);
        setDescription(response?.data?.data?.description);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBlogDetailsFunc();
  }, [params?.id]);
  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Blog Management" selectedItem="Add Blog" />
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
                    Update Blog
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label>Banner*</label>
                  <div>
                    <img
                      src={formData?.imgPrev}
                      style={{ height: "200px" }}
                      className="img-fluid w-100 shadow rounded mb-2"
                    />
                  </div>
                  <input
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files[0],
                        imgPrev: URL.createObjectURL(e.target.files[0]),
                      })
                    }
                    className="form-control"
                    type="file"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Title*</label>
                  <input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>SEO Title*</label>
                  <input
                    value={formData.seoTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, seoTitle: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="col-6 mb-3">
                  <label>Meta Keyword* (Seperate by coma)</label>
                  <input
                    value={formData.metaKeyword}
                    onChange={(e) =>
                      setFormData({ ...formData, metaKeyword: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Tags (seperate by coma)</label>
                  <input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Rank*</label>
                  <input
                    type="number"
                    value={formData.rank}
                    onChange={(e) =>
                      setFormData({ ...formData, rank: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="col-6 mb-3">
                  <label>Status*</label>
                  <select
                      className="form-control"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                      value={formData?.status}
                    >
                      <option value="">Select Status</option>
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                </div>

                <div className="col-12 mb-3">
                  <label>Meta Description*</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metaDescription: e.target.value,
                      })
                    }
                    className="form-control"
                    rows={3}
                  />
                </div>

                <div className="col-12 mb-3">
                  <label>Short Description*</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={shortDescription}
                    onChange={(newContent) => setShortDescription(newContent)}
                  />
                </div>

                <div className="col-12 mb-3">
                  <label>Description*</label>
                  <JoditEditor
                    ref={editor}
                    config={config}
                    value={description}
                    onChange={(newContent) => setDescription(newContent)}
                  />
                </div>

                <div className="col-12">
                  <button
                    className="btn btn-primary w-100"
                    style={{
                      background: isFormValid ? "#05E2B5" : "#61ce70",
                      border: "none",
                      borderRadius: "24px",
                      opacity: loader ? 0.6 : 1,
                    }}
                    onClick={isFormValid && !loader ? handleSubmit : null}
                    disabled={!isFormValid || loader}
                  >
                    {loader ? "Saving..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateBlog;
