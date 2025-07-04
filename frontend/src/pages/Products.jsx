import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Table,
  message,
  Image,
  Upload,
  Tag,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import moment from "moment";
import { API_URL, BASE_URL } from "../../config/Contant";
import Sidebar from "../components/Sidebar";
import Header1 from "../components/Header1";
import {
  addProduct,
  deleteProduct,
  editProduct,
  fetchProducts,
} from "../redux/productSlice";

export default function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();
  const { items, total, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit }));
  }, [dispatch, page, limit]);

  const save = async (values) => {
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("description", values.description);
    fd.append("price", values.price);
    if (values.image?.[0]?.originFileObj) {
      fd.append("image", values.image[0].originFileObj);
    }

    try {
      if (editing) {
        await dispatch(editProduct({ id: editing._id, formData: fd })).unwrap();
        message.success("Product updated successfully");
      } else {
        await dispatch(addProduct(fd)).unwrap();
        message.success("Product added successfully");
      }
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
    } catch (err) {
      console.error("Error saving product:", err);
      message.error(err.message || "Operation failed");
    }
  };

  const remove = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      message.success("Product deleted successfully");
    } catch (err) {
      message.error("Failed to delete product");
    }
  };

  const columns = [
    { title: "S.No", render: (_, __, i) => (page - 1) * limit + i + 1 },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (src) => <Image src={`${BASE_URL}/${src}`} width={80} />,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Description", dataIndex: "description" },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => <Tag color="green">₹{price.toFixed(2)}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      render: (date) => (
        <Tag color="blue">{moment(date).format("YYYY-MM-DD HH:mm")}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => {
        const imgList = record.imageUrl
          ? [
              {
                uid: "-1",
                name: record.imageUrl,
                status: "done",
                url: `${BASE_URL}/${record.imageUrl}`,
              },
            ]
          : [];
        return (
          <div className="flex gap-2">
            <Button
              icon={<FaPencilAlt />}
              onClick={() => {
                setEditing(record);
                form.setFieldsValue({ ...record, image: imgList });
                setIsModalOpen(true);
              }}
            />
            <Button
              danger
              icon={<FaTrashAlt />}
              onClick={() => remove(record._id)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col w-full">
        <Header1 setSidebarOpen={setSidebarOpen} />
        <div className="p-3">
          <div className="flex justify-between items-center m-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              variant="solid"
              color="blue"
              onClick={() => {
                setEditing(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Add Product
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={items}
            rowKey={(record) => record._id}
            loading={loading}
            scroll={{ x: "max-content" }}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              onChange: (pg, sz) => {
                setPage(pg);
                setLimit(sz);
              },
            }}
          />
          <Modal
            open={isModalOpen}
            onCancel={() => {
              setEditing(null);
              setIsModalOpen(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={save}>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    name="price"
                    label="Price (₹)"
                    rules={[{ required: true }]}
                  >
                    <Input type="number" step="0.01" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true }]}
                  >
                    <Input.TextArea autoSize={{ minRows: 4 }} />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="image"
                    label="Product Image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => e?.fileList || []}
                  >
                    <Upload
                      beforeUpload={() => false}
                      listType="picture"
                      maxCount={1}
                      accept="image/*"
                    >
                      <Button icon={<UploadOutlined />}>Select Image</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-blue-600 mt-4"
              >
                {editing ? "Update Product" : "Add Product"}
              </Button>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
