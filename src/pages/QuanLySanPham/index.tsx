import { useModel } from 'umi';
import { useState } from 'react';
import { Table, Popconfirm, message, Button, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import type { product } from '@/models/sanpham';

const QuanLySanPham = () => {
	const { sanPham, sanPhamList, addSanPham } = useModel('sanpham');
	const [visible, setVisible] = useState<boolean>(false);
	const [isSearch, setisSearch] = useState('');
	const [form] = Form.useForm<Omit<product, 'id'>>();

	const searchkey = sanPham.filter((item) => item.name.toLowerCase().includes(isSearch.toLowerCase()));

	const handleaddproduct = (values: Omit<product, 'id'>) => {
		addSanPham(values);
		message.success('thêm sản phẩm thành công');
		console.log(values, sanPham);
		form.resetFields();
	};
	const columns = [
		{
			title: 'STT',
			dataIndex: 'id',
			key: 'id',
			align: 'center' as const,
		},
		{
			title: 'tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			align: 'center' as const,
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			align: 'center' as const,
		},
		{
			title: 'Số lượng',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'center' as const,
			render: (_: any, record: any) => {
				return (
					<div>
						<Popconfirm
							title='Bạn có chắc chắn muốn xóa?'
							onConfirm={() => {
								sanPhamList(sanPham.filter((item) => item.id !== record.id));
								message.success('Xóa sản phẩm thành công');
							}}
							okText='Có'
							cancelText='Không'
						>
							<Button style={{ backgroundColor: '#c10003', color: 'white' }}>Xóa</Button>
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
							setVisible(true);
						}}
					>
						Thêm Sản Phẩm
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

			<Modal title='Thêm Sản Phẩm' visible={visible} onCancel={() => setVisible(false)} footer={null}>
				<Form<Omit<product, 'id'>> form={form} layout='vertical' onFinish={handleaddproduct}>
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
							thêm mới
						</Button>

						<Button onClick={() => setVisible(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</div>
	);
};
export default QuanLySanPham;
