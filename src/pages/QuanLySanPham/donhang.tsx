import { useModel } from 'umi';
import { useState, useMemo, useEffect } from 'react';
import {
	Table,
	Popconfirm,
	message,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Row,
	Col,
	Select,
	Descriptions,
	Tag,
} from 'antd';
import type { Order, OrderProduct } from '@/models/donhang';
import type { product } from '@/models/sanpham';
import Item from 'antd/lib/list/Item';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const QuanLyDonHang = () => {
	const { donhang, setDonhang, addDonHang, tongDonHang, tongTien } = useModel('donhang') as unknown as {
		donhang: Order[];
		setDonhang: (data: Order[]) => void;
		addDonHang: (item: Omit<Order, 'id'>) => void;
		tongTien: (products: OrderProduct[]) => number;
		tongDonHang: (products: OrderProduct[]) => number;
	};
	const { sanPham, truTonKho } = useModel('sanpham') as {
		sanPham: product[];
		truTonKho: (products: OrderProduct[]) => void;
	};
	const [visible, setVisible] = useState(false);
	const [issetEdit, setIsSetEdit] = useState<Order | null>(null);
	const [detailOrder, setDetailOrder] = useState<Order | null>(null);
	const [isSearch, setIsSearch] = useState('');
	const [form] = Form.useForm<Order>();

	const searchkey = donhang.filter((item: Order) => item.customerName.toLowerCase().includes(isSearch.toLowerCase()));

	const detailTotalAmount = useMemo(() => tongTien(detailOrder?.products || []), [detailOrder?.products]);

	const handleaddoder = () => {
		const values = form.getFieldsValue();
		const newOrder = {
			...values,
			createdAt: new Date().toISOString(),
			totalAmount: tongTien(values.products || []),
			status: 'Chờ xử lý',
		};
		addDonHang(newOrder);
		message.success('thêm đơn hàng thành công');
		setIsSetEdit(null);
		setVisible(false);
		form.resetFields();
		truTonKho(values.products || []);
	};

	const handleeditoder = () => {
		if (!issetEdit) return;
		const editedhandleeditoder = donhang.map((item: Order) => {
			if (item.id === issetEdit.id) {
				return { ...item, ...form.getFieldsValue() };
			}
			return item;
		});
		setDonhang(editedhandleeditoder);
		message.success('Cập nhật đơn hàng thành công');
		setIsSetEdit(null);
		setVisible(false);
		form.resetFields();
		truTonKho(form.getFieldValue('products') || []);
	};
	const selectedProducts = Form.useWatch('selectedProducts', form);

	useEffect(() => {
		if (!selectedProducts) return;

		const currentProducts = form.getFieldValue('products') || [];

		const newProducts = selectedProducts.map((id: number) => {
			const sp = sanPham.find((p) => p.id === id);
			const existed = currentProducts.find((p: OrderProduct) => p.productId === id);

			return {
				productId: id,
				productName: sp?.name || '',
				price: sp?.price || 0,
				quantity: existed?.quantity || 1,
			};
		});

		form.setFieldsValue({ products: newProducts });
	}, [selectedProducts]);

	const ORDER_STATUS = [
		{ value: 'pending', label: 'Chờ xử lý' },
		{ value: 'shipping', label: 'Đang giao' },
		{ value: 'completed', label: 'Hoàn thành' },
		{ value: 'cancelled', label: 'Đã hủy' },
	];

	const onEdit = (record: Order) => {
		setIsSetEdit(record);
		form.setFieldsValue({
			customerName: record.customerName,
			phone: record.phone,
			address: record.address,
			totalAmount: record.totalAmount,
			status: record.status,
			products: record.products,
			selectedProducts: record.products.map((p) => p.productId),
		} as any);
		setVisible(true);
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
			title: 'mã đơn hàng',
			dataIndex: 'id',
			key: 'id',
			align: 'center' as const,
		},
		{
			title: 'Tên khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
			align: 'center' as const,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			align: 'center' as const,
		},
		{
			title: 'Tổng sản phẩm',
			dataIndex: 'tongsp',
			render: (_: any, record: Order) => tongDonHang(record.products),
			align: 'center' as const,
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'totalAmount',
			align: 'center' as const,
			render: (_: any, record: Order) =>
				tongTien(record.products).toLocaleString('vi-VN', {
					style: 'currency',
					currency: 'VND',
				}),
		},
		{
			title: 'Thời gian đặt hàng',
			dataIndex: 'createdAt',
			key: 'createdAt',
			align: 'center' as const,
			render: (value?: string) => {
				if (!value) return '--';
				const d = new Date(value);
				return isNaN(d.getTime()) ? '--' : d.toLocaleString('vi-VN');
			},
		},
		{
			title: 'trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center' as const,
			render: (status: string) => {
				switch (status) {
					case 'pending':
						return <Tag color='orange'>Chờ xử lý</Tag>;
					case 'shipping':
						return <Tag color='blue'>Đang giao</Tag>;
					case 'completed':
						return <Tag color='green'>Hoàn thành</Tag>;
					case 'cancelled':
						return <Tag color='red'>Đã hủy</Tag>;
					default:
						return <Tag>{status}</Tag>;
				}
			},
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: Order) => {
				return (
					<div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
						<EditOutlined
							title='Sửa'
							onClick={() => onEdit(record)}
							style={{ fontSize: 16, color: '#1890ff', cursor: 'pointer' }}
						/>
						<Popconfirm
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => {
								setDonhang(donhang.filter((item: Order) => item.id !== record.id));
								message.success('Xóa đơn hàng thành công');
							}}
							okText='Có'
							cancelText='Không'
						>
							<DeleteOutlined title='Xóa' style={{ fontSize: 16, color: '#ff4d4f', cursor: 'pointer' }} />
						</Popconfirm>
						<EyeOutlined
							title='Xem chi tiết'
							onClick={() => setDetailOrder(record)}
							style={{ fontSize: 16, color: '#52c41a', cursor: 'pointer' }}
						/>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<h2>Quản Lý đơn hàng</h2>
			<Row justify='space-between' align='middle'>
				<Col>
					<Button
						type='primary'
						style={{ marginBottom: 16 }}
						onClick={() => {
							setVisible(true);
						}}
					>
						Thêm đơn hàng
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
							onChange={(e) => setIsSearch(e.target.value)}
						/>
					</div>
				</Col>
			</Row>
			<Table dataSource={searchkey} columns={columns} rowKey='id' />
			<Modal
				visible={!!detailOrder}
				onCancel={() => setDetailOrder(null)}
				footer={null}
				width={800}
				title='Chi tiết đơn hàng'
			>
				{detailOrder && (
					<>
						<Descriptions bordered column={2} size='small'>
							<Descriptions.Item label='Mã đơn'>{detailOrder.id}</Descriptions.Item>
							<Descriptions.Item label='Khách hàng'>{detailOrder.customerName}</Descriptions.Item>
							<Descriptions.Item label='SĐT'>{detailOrder.phone}</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ'>{detailOrder.address}</Descriptions.Item>
							<Descriptions.Item label='Trạng thái'>{detailOrder.status}</Descriptions.Item>
							<Descriptions.Item label='Ngày tạo'>{detailOrder.createdAt}</Descriptions.Item>
						</Descriptions>

						<Table
							style={{ marginTop: 16 }}
							dataSource={detailOrder.products}
							rowKey='productId'
							pagination={false}
							columns={[
								{
									title: 'Sản phẩm',
									dataIndex: 'productName',
									align: 'center' as const,
									sorter: (a: OrderProduct, b: OrderProduct) => a.price - b.price,
								},
								{
									title: 'Giá',
									dataIndex: 'price',
									render: (v: number) => v.toLocaleString(),
									align: 'center' as const,
									sorter: (a: OrderProduct, b: OrderProduct) => a.price - b.price,
								},
								{
									title: 'Số lượng',
									dataIndex: 'quantity',
									align: 'center' as const,
									sorter: (a: OrderProduct, b: OrderProduct) => a.quantity - b.quantity,
								},
								{
									title: 'Thành tiền',
									render: (_, r: OrderProduct) => (r.price * r.quantity).toLocaleString(),
									align: 'center' as const,
								},
							]}
						/>
						<div style={{ textAlign: 'right', marginTop: 16 }}>
							<b>Tổng tiền: {detailTotalAmount.toLocaleString()} đ</b>
						</div>
					</>
				)}
			</Modal>

			<Modal
				title={issetEdit ? 'chỉnh sửa' : 'Thêm mới'}
				visible={visible}
				onCancel={() => setVisible(false)}
				footer={null}
			>
				<Form<Omit<Order, 'id'>> form={form} layout='vertical' onFinish={issetEdit ? handleeditoder : handleaddoder}>
					<Form.Item
						label='Tên khách hàng'
						name='customerName'
						rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label='Số điện thoại'
						name='phone'
						rules={[
							{ required: true, message: 'Vui lòng nhập số điện thoại' },
							{
								pattern: /^0\d{10}$/,
								message: 'Số điện thoại phải gồm 11 số và bắt đầu bằng 0',
							},
						]}
					>
						<Input maxLength={11} />
					</Form.Item>
					<Form.Item label='Địa chỉ' name='address' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label='Chọn sản phẩm'
						name='selectedProducts'
						rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
					>
						<Select mode='multiple' placeholder='Chọn sản phẩm' optionFilterProp='label'>
							{sanPham.map((sp) => (
								<Select.Option key={sp.id} value={sp.id} label={sp.name} disabled={sp.quantity === 0}>
									{sp.name} – {sp.price.toLocaleString()}đ (Còn: {sp.quantity})
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.List name='products'>
						{(fields) => (
							<>
								{fields.map(({ key, name }) => (
									<Row key={key} gutter={8} align='middle' style={{ marginTop: 8 }}>
										<Col span={10}>
											<Form.Item name={[name, 'productName']} noStyle>
												<span />
											</Form.Item>
										</Col>

										<Col span={4}>
											<Form.Item name={[name, 'price']} noStyle>
												{(price) => <span>{price?.toLocaleString()}đ</span>}
											</Form.Item>
										</Col>

										<Col span={6}>
											<Form.Item
												name={[name, 'quantity']}
												rules={[
													{ required: true, message: 'Nhập số lượng' },
													({ getFieldValue }) => ({
														validator(_, value) {
															if (issetEdit) return Promise.resolve();

															const productId = getFieldValue(['products', name, 'productId']);
															const sp = sanPham.find((p) => p.id === productId);

															if (!sp || !value) return Promise.resolve();
															if (value > sp.quantity) {
																return Promise.reject(new Error(`Tồn kho chỉ còn ${sp.quantity}`));
															}
															return Promise.resolve();
														},
													}),
												]}
												style={{ marginBottom: 0 }}
											>
												<InputNumber min={1} style={{ width: '100%' }} />
											</Form.Item>
										</Col>

										<Col span={4}>
											<Form.Item shouldUpdate noStyle>
												{() => {
													const p = form.getFieldValue(['products', name]);
													return <span>{(p?.price * p?.quantity || 0).toLocaleString()}đ</span>;
												}}
											</Form.Item>
										</Col>
									</Row>
								))}
							</>
						)}
					</Form.List>

					<Form.Item
						label='Trạng thái'
						name='status'
						rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
					>
						<Select placeholder='Chọn trạng thái'>
							{ORDER_STATUS.map((item) => (
								<Select.Option key={item.value} value={item.value}>
									{item.label}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.products !== currentValues.products}>
						{() => {
							const products = (form.getFieldValue('products') || []).filter((p: any) => p);
							const total = tongTien(products);
							return (
								<div style={{ textAlign: 'right', marginTop: 16 }}>
									<b>Tổng tiền: {total.toLocaleString()} đ</b>
								</div>
							);
						}}
					</Form.Item>
					<div className='form-footer'>
						<Button style={{ backgroundColor: '#c10003', color: 'white' }} type='primary' htmlType='submit'>
							{issetEdit ? 'Cập nhật' : 'Thêm mới'}
						</Button>
						<Button onClick={() => setVisible(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyDonHang;
