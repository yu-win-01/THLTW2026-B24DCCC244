import React, { useState } from 'react';
import {
	Card,
	Button,
	Drawer,
	Form,
	Select,
	Input,
	InputNumber,
	DatePicker,
	Popconfirm,
	Space,
	Progress,
	Segmented,
	Row,
	Col,
} from 'antd';
import {
	PlusOutlined,
	EditOutlined,
	DeleteOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { Goal } from '@/models/ungdungtheodoisuckhoe';

const { Option } = Select;

interface DuLieuBieuMauMucTieu {
	tenMucTieu: string;
	loai: Goal['loai'];
	giaTriMucTieu: number;
	giaTriHienTai: number;
	hanChot: dayjs.Dayjs;
}

const QuanLyMucTieu: React.FC = () => {
	const { danhSachMucTieu, themMucTieu, capNhatMucTieu, xoaMucTieu } = useModel('ungdungtheodoisuckhoe');
	const [moDrawer, setMoDrawer] = useState(false);
	const [mucTieuDangSua, setMucTieuDangSua] = useState<Goal | null>(null);
	const [bieuMau] = Form.useForm();
	const [locTrangThai, setLocTrangThai] = useState<string>('all');

	const moDrawerSua = (mucTieu?: Goal) => {
		setMucTieuDangSua(mucTieu || null);
		if (mucTieu) {
			bieuMau.setFieldsValue({
				tenMucTieu: mucTieu.tenMucTieu,
				loai: mucTieu.loai,
				giaTriMucTieu: mucTieu.giaTriMucTieu,
				giaTriHienTai: mucTieu.giaTriHienTai,
				hanChot: dayjs(mucTieu.hanChot),
			});
		} else {
			bieuMau.resetFields();
		}
		setMoDrawer(true);
	};

	const xuLyDongDrawer = () => {
		setMoDrawer(false);
		setMucTieuDangSua(null);
		bieuMau.resetFields();
	};

	const xuLyGui = async () => {
		try {
			const giaTri = await bieuMau.validateFields();
			const duLieuBieuMau: DuLieuBieuMauMucTieu = giaTri;

			const duLieuMucTieu = {
				tenMucTieu: duLieuBieuMau.tenMucTieu,
				loai: duLieuBieuMau.loai,
				giaTriMucTieu: duLieuBieuMau.giaTriMucTieu,
				giaTriHienTai: duLieuBieuMau.giaTriHienTai,
				hanChot: duLieuBieuMau.hanChot.toISOString(),
				trangThai: 'Đang thực hiện' as Goal['trangThai'],
			};

			if (mucTieuDangSua) {
				capNhatMucTieu(mucTieuDangSua.id, duLieuMucTieu);
			} else {
				themMucTieu(duLieuMucTieu);
			}

			xuLyDongDrawer();
		} catch (loi) {
			console.error('Xác thực thất bại:', loi);
		}
	};

	const xuLyXoa = (id: string) => {
		xoaMucTieu(id);
	};

	const xuLyThayDoiGiaTriHienTai = (id: string, giaTri: number) => {
		capNhatMucTieu(id, { giaTriHienTai: giaTri });
	};

	const layBieuTuongTrangThai = (trangThai: Goal['trangThai']) => {
		switch (trangThai) {
			case 'Đã đạt':
				return <CheckCircleOutlined style={{ color: 'green' }} />;
			case 'Đang thực hiện':
				return <ClockCircleOutlined style={{ color: 'blue' }} />;
			case 'Đã hủy':
				return <CloseCircleOutlined style={{ color: 'red' }} />;
			default:
				return null;
		}
	};

	const danhSachMucTieuDaLoc = danhSachMucTieu.filter((mucTieu) => {
		if (locTrangThai === 'all') return true;
		return mucTieu.trangThai === locTrangThai;
	});

	return (
		<div>
			<Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => moDrawerSua()}>
					Thêm mục tiêu
				</Button>
				<Segmented
					options={[
						{ label: 'Tất cả', value: 'all' },
						{ label: 'Đang thực hiện', value: 'Đang thực hiện' },
						{ label: 'Đã đạt', value: 'Đã đạt' },
						{ label: 'Đã hủy', value: 'Đã hủy' },
					]}
					value={locTrangThai}
					onChange={(giaTri) => setLocTrangThai(giaTri as string)}
				/>
			</Space>

			<Row gutter={16}>
				{danhSachMucTieuDaLoc.map((mucTieu) => (
					<Col span={8} key={mucTieu.id} style={{ marginBottom: 16 }}>
						<Card
							title={mucTieu.tenMucTieu}
							extra={
								<Space>
									<Button type='link' icon={<EditOutlined />} onClick={() => moDrawerSua(mucTieu)} />
									<Popconfirm
										title='Bạn có chắc muốn xóa mục tiêu này?'
										onConfirm={() => xuLyXoa(mucTieu.id)}
										okText='Có'
										cancelText='Không'
									>
										<Button type='link' danger icon={<DeleteOutlined />} />
									</Popconfirm>
								</Space>
							}
						>
							<p>
								<strong>Loại:</strong> {mucTieu.loai}
							</p>
							<p>
								<strong>Mục tiêu:</strong> {mucTieu.giaTriMucTieu}
							</p>
							<p>
								<strong>Hiện tại:</strong>
								<InputNumber
									min={0}
									value={mucTieu.giaTriHienTai}
									onChange={(giaTri) => xuLyThayDoiGiaTriHienTai(mucTieu.id, giaTri || 0)}
									style={{ width: 80, marginLeft: 8 }}
								/>
							</p>
							<Progress
								percent={Math.min((mucTieu.giaTriHienTai / mucTieu.giaTriMucTieu) * 100, 100)}
								status={mucTieu.giaTriHienTai >= mucTieu.giaTriMucTieu ? 'success' : 'active'}
							/>
							<p>
								<strong>Deadline:</strong> {dayjs(mucTieu.hanChot).format('DD/MM/YYYY')}
							</p>
							<p>
								<strong>Trạng thái:</strong> {layBieuTuongTrangThai(mucTieu.trangThai)} {mucTieu.trangThai}
							</p>
						</Card>
					</Col>
				))}
			</Row>

			<Drawer
				title={mucTieuDangSua ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
				width={400}
				visible={moDrawer}
				onClose={xuLyDongDrawer}
				extra={
					<Space>
						<Button onClick={xuLyDongDrawer}>Hủy</Button>
						<Button type='primary' onClick={xuLyGui}>
							Lưu
						</Button>
					</Space>
				}
			>
				<Form form={bieuMau} layout='vertical'>
					<Form.Item
						name='tenMucTieu'
						label='Tên mục tiêu'
						rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='loai'
						label='Loại mục tiêu'
						rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu!' }]}
					>
						<Select placeholder='Chọn loại mục tiêu'>
							<Option value='Giảm cân'>Giảm cân</Option>
							<Option value='Tăng cơ'>Tăng cơ</Option>
							<Option value='Cải thiện sức bền'>Cải thiện sức bền</Option>
							<Option value='Khác'>Khác</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name='giaTriMucTieu'
						label='Giá trị mục tiêu'
						rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu!' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item
						name='giaTriHienTai'
						label='Giá trị hiện tại'
						rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại!' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name='hanChot' label='Deadline' rules={[{ required: true, message: 'Vui lòng chọn deadline!' }]}>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	);
};

export default QuanLyMucTieu;
