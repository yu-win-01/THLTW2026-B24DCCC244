import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'umi';
import { Button, Card, Tag, Divider, Space, Row, Col, Typography, Empty, Tooltip, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import useUngDungBlogCaNhan, { type UngDungBlogCaNhan } from '@/models/ungdungblogcanhan';

const { Title, Text } = Typography;

const TrangChiTietBaiViet: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	const { getPostById, incrementPostViews, getRelatedPosts, tags } = useUngDungBlogCaNhan();
	const [post, setPost] = useState<UngDungBlogCaNhan.Post | null>(null);
	const [relatedPosts, setRelatedPosts] = useState<UngDungBlogCaNhan.Post[]>([]);

	useEffect(() => {
		const foundPost = getPostById(id);
		if (foundPost) {
			incrementPostViews(id);
			setPost({ ...foundPost, views: foundPost.views + 1 });
			const related = getRelatedPosts(id);
			setRelatedPosts(related);
		}
	}, [id, getPostById, incrementPostViews, getRelatedPosts]);

	if (!post) {
		return (
			<div style={{ padding: '48px 0', textAlign: 'center' }}>
				<Empty description='Không tìm thấy bài viết' />
				<Button
					type='primary'
					icon={<ArrowLeftOutlined />}
					onClick={() => history.push('/he-thong-ung-dung-blog-ca-nhan/trang-chu')}
					style={{ marginTop: 16 }}
				>
					Quay lại trang chủ
				</Button>
			</div>
		);
	}

	const handleBack = () => {
		history.push('/he-thong-ung-dung-blog-ca-nhan/trang-chu');
	};

	const handleRelatedClick = (postId: string) => {
		history.push(`/he-thong-ung-dung-blog-ca-nhan/trang-chi-tiet-bai-viet/${postId}`);
	};

	const postTags = post.tags
		.map((tagId) => tags.find((t) => t.id === tagId))
		.filter((tag) => tag !== undefined) as UngDungBlogCaNhan.Tag[];

	return (
		<div style={{ paddingBottom: 48 }}>
			{/* Breadcrumb */}
			<Breadcrumb style={{ marginBottom: 24 }}>
				<Breadcrumb.Item>
					<Button type='link' onClick={() => history.push('/he-thong-ung-dung-blog-ca-nhan/trang-chu')}>
						Trang chủ
					</Button>
				</Breadcrumb.Item>
				<Breadcrumb.Item>{post.title}</Breadcrumb.Item>
			</Breadcrumb>

			{/* Back Button */}
			<div style={{ marginBottom: 16 }}>
				<Button icon={<ArrowLeftOutlined />} onClick={handleBack} type='default'>
					Quay lại
				</Button>
			</div>

			{/* Main Post Card */}
			<Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} bodyStyle={{ padding: '32px' }}>
				{/* Post Header Image */}
				{post.thumbnail && (
					<div style={{ marginBottom: 24, borderRadius: 8, overflow: 'hidden' }}>
						<img
							src={post.thumbnail}
							alt={post.title}
							style={{
								width: '100%',
								maxHeight: 400,
								objectFit: 'cover',
								display: 'block',
							}}
						/>
					</div>
				)}

				{/* Post Title */}
				<Title level={1} style={{ marginBottom: 24 }}>
					{post.title}
				</Title>

				{/* Post Meta Information */}
				<Space direction='vertical' size='large' style={{ width: '100%', marginBottom: 24 }}>
					<Row gutter={[24, 16]}>
						<Col xs={24} sm={12} md={6}>
							<Space>
								<UserOutlined style={{ fontSize: 16, color: '#1890ff' }} />
								<Text strong>Tác giả:</Text>
								<Text>{post.author}</Text>
							</Space>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Space>
								<CalendarOutlined style={{ fontSize: 16, color: '#1890ff' }} />
								<Text strong>Ngày tạo:</Text>
								<Text>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</Text>
							</Space>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Space>
								<EyeOutlined style={{ fontSize: 16, color: '#1890ff' }} />
								<Text strong>Lượt xem:</Text>
								<Text>{post.views}</Text>
							</Space>
						</Col>
						<Col xs={24} sm={12} md={6}>
							<Space>
								<Text strong>Trạng thái:</Text>
								<Tag color={post.status === 'published' ? 'green' : 'orange'}>
									{post.status === 'published' ? 'Đã đăng' : 'Nháp'}
								</Tag>
							</Space>
						</Col>
					</Row>

					{/* Tags */}
					{postTags.length > 0 && (
						<div>
							<Text strong style={{ marginRight: 12 }}>
								Thẻ:
							</Text>
							<Space wrap>
								{postTags.map((tag) => (
									<Tooltip key={tag.id} title={`${tag.postCount} bài viết`}>
										<Tag
											color='blue'
											style={{
												cursor: 'pointer',
												padding: '4px 12px',
												fontSize: 13,
											}}
										>
											#{tag.name}
										</Tag>
									</Tooltip>
								))}
							</Space>
						</div>
					)}
				</Space>

				<Divider />

				{/* Post Content */}
				<div
					className='markdown-content'
					style={{
						fontSize: 16,
						lineHeight: 1.8,
						color: 'rgba(0,0,0,0.85)',
					}}
				>
					<ReactMarkdown>{post.content}</ReactMarkdown>
				</div>

				<Divider style={{ marginTop: 32 }} />

				{/* Post Footer */}
				<Row justify='space-between' align='middle' style={{ marginTop: 24 }}>
					<Col>
						<Text type='secondary' italic>
							Cập nhật lần cuối: {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
						</Text>
					</Col>
					<Col>
						<Space>
							<Text type='secondary'>Chia sẻ bài viết này</Text>
						</Space>
					</Col>
				</Row>
			</Card>

			{/* Related Posts Section */}
			{relatedPosts.length > 0 && (
				<div style={{ marginTop: 48 }}>
					<Title level={2} style={{ marginBottom: 24 }}>
						📖 Bài viết liên quan
					</Title>
					<Row gutter={[16, 16]}>
						{relatedPosts.map((relPost) => {
							const relatedTags = relPost.tags
								.map((tagId) => tags.find((t) => t.id === tagId))
								.filter((tag) => tag !== undefined) as UngDungBlogCaNhan.Tag[];

							return (
								<Col xs={24} sm={12} lg={8} key={relPost.id}>
									<Card
										hoverable
										onClick={() => handleRelatedClick(relPost.id)}
										style={{ height: '100%', cursor: 'pointer' }}
										cover={
											relPost.thumbnail && (
												<img alt={relPost.title} src={relPost.thumbnail} style={{ height: 200, objectFit: 'cover' }} />
											)
										}
									>
										<Card.Meta
											title={
												<div
													style={{
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														display: '-webkit-box',
														WebkitLineClamp: 2,
														WebkitBoxOrient: 'vertical',
													}}
												>
													<Text style={{ fontSize: 14, fontWeight: 600 }}>{relPost.title}</Text>
												</div>
											}
											description={
												<div
													style={{
														overflow: 'hidden',
														textOverflow: 'ellipsis',
														display: '-webkit-box',
														WebkitLineClamp: 2,
														WebkitBoxOrient: 'vertical',
													}}
												>
													<Text type='secondary' style={{ fontSize: 13 }}>
														{relPost.content.substring(0, 80)}...
													</Text>
												</div>
											}
										/>
										<Space direction='vertical' size='small' style={{ width: '100%', marginTop: 12 }}>
											<Space size='small'>
												<CalendarOutlined />
												<Text type='secondary' style={{ fontSize: 12 }}>
													{new Date(relPost.createdAt).toLocaleDateString('vi-VN')}
												</Text>
											</Space>
											{relatedTags.length > 0 && (
												<Space size='small' wrap>
													{relatedTags.slice(0, 2).map((tag) => (
														<Tag key={tag.id} color='blue'>
															{tag.name}
														</Tag>
													))}
												</Space>
											)}
										</Space>
									</Card>
								</Col>
							);
						})}
					</Row>
				</div>
			)}
		</div>
	);
};

export default TrangChiTietBaiViet;
