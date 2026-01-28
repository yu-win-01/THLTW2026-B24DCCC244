import { useModel } from 'umi';
import { useState } from 'react';
import { Table, Popconfirm, message, Button, Modal, Form, Input, InputNumber, Tag, Col, Row } from 'antd';
import type { product } from '@/models/sanpham';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const QuanLySanPham = () => {
	const { sanPham, sanPhamList, addSanPham } = useModel('sanpham');
	const [isopen, setisopen] = useState<boolean>(false);
	const [issetEdit, setIsSetEdit] = useState<any>(null);
	const [form] = Form.useForm<product>();
	const [isSearch, setisSearch] = useState('');
	const searchkey = sanPham.filter((item) => item.name.toLowerCase().includes(isSearch.toLowerCase()));

	const handleaddproduct = () => {
		addSanPham(form.getFieldsValue() as product);
		message.success('thêm sản phẩm thành công');
		setIsSetEdit(null);
		setisopen(false);
		form.resetFields();
	};

	const handleeditproduct = () => {
		const editedProduct = sanPham.map((item) => {
			if (item.id === issetEdit.id) {
				return { ...item, ...form.getFieldsValue() };
			}
			return item;
		});
		sanPhamList(editedProduct);
		message.success('Cập nhật sản phẩm thành công');
		setIsSetEdit(null);
		setisopen(false);
		form.resetFields();
	};
	const onEdit = (record: product) => {
		setIsSetEdit(record);
		form.setFieldsValue({
			name: record.name,
			price: record.price,
			quantity: record.quantity,
		});
		setisopen(true);
	};

	const columns = [
		{
			title: 'STT',
			dataIndex: 'stt',
			key: 'stt',
			align: 'center' as const,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			align: 'center' as const,
			sorter: (a: product, b: product) => a.name.localeCompare(b.name),
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			align: 'center' as const,
			sorter: (a: product, b: product) => a.price - b.price,
			render: (_: any, record: any) => record.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
			sorter: (a: product, b: product) => a.quantity - b.quantity,
		},
		{
			title: 'trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center' as const,
			render: (_: any, record: any) => {
				const quantity = record.quantity;

				if (quantity > 10) return <Tag color='green'>Còn hàng</Tag>;
				if (quantity > 0) return <Tag color='orange'>Sắp hết</Tag>;
				return <Tag color='red'>Hết hàng</Tag>;
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: any) => {
				return (
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
						<EditOutlined
							title='Sửa'
							style={{ fontSize: 16, color: '#1890ff', cursor: 'pointer' }}
							onClick={() => onEdit(record)}
						/>

						<Popconfirm
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => {
								sanPhamList(sanPham.filter((item) => item.id !== record.id));
								message.success('Xóa sản phẩm thành công');
							}}
							okText='Có'
							cancelText='Không'
						>
							<DeleteOutlined style={{ fontSize: 16, color: '#ff4d4f', cursor: 'pointer' }} title='Xóa' />
						</Popconfirm>
					</div>
				);
			},
		},
	];
	return (
		<div>
			<h2>Quản Lý Sản Phẩm</h2>
			<Row justify='space-between' align='middle'>
				<Col>
					<Button
						type='primary'
						style={{ marginBottom: 16 }}
						onClick={() => {
							setisopen(true);
						}}
					>
						Thêm sản phẩm
					</Button>
				</Col>
				<Col>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span style={{ whiteSpace: 'nowrap' }}>Tìm kiếm:</span>
						<Input
							type='text'
							placeholder='Nhập từ khóa...'
							style={{ width: 200 }}
							value={isSearch}
							onChange={(e) => setisSearch(e.target.value)}
						/>
					</div>
				</Col>
			</Row>
			<Table dataSource={searchkey} columns={columns} rowKey='id' />

			<Modal
				title={issetEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
				visible={isopen}
				onCancel={() => setisopen(false)}
				footer={null}
			>
				<Form<Omit<product, 'id'>>
					form={form}
					layout='vertical'
					onFinish={issetEdit ? handleeditproduct : handleaddproduct}
				>
					<Form.Item label='tên' name='name' rules={[{ required: true, message: 'hãy ghi tên vào ô trống!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label='giá'
						name='price'
						rules={[{ required: true, type: 'integer', message: 'hãy ghi giá vào ô trống!' }]}
					>
						<InputNumber precision={0} min={0} />
					</Form.Item>
					<Form.Item
						label='số lượng'
						name='quantity'
						rules={[{ required: true, type: 'integer', message: 'hãy ghi số lượng vào ô trống!' }]}
					>
						<InputNumber precision={0} min={0} />
					</Form.Item>
					<div className='form-footer'>
						<Button style={{ backgroundColor: '#c10003', color: 'white' }} type='primary' htmlType='submit'>
							{issetEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
						</Button>

						<Button onClick={() => setisopen(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};
export default QuanLySanPham;
