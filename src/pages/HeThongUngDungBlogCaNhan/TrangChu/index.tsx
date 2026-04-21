import React, { useState, useEffect, useMemo } from 'react';
import { Card, Pagination, Input, Tag, Row, Col } from 'antd';
import { useHistory } from 'umi';
import type { UngDungBlogCaNhan } from '@/models/ungdungblogcanhan';
import useUngDungBlogCaNhan from '@/models/ungdungblogcanhan';

const { Search } = Input;

const TrangChu: React.FC = () => {
	const history = useHistory();
	const { posts, tags, getPublishedPosts, searchPosts, getPostsByTag } = useUngDungBlogCaNhan();
	const [filteredPosts, setFilteredPosts] = useState<UngDungBlogCaNhan.Post[]>([]);
	const [selectedTag, setSelectedTag] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 9;

	useEffect(() => {
		setFilteredPosts(getPublishedPosts());
	}, [posts, getPublishedPosts]);

	const filterPosts = (query: string, tagId: string) => {
		let filtered = getPublishedPosts();
		if (query) {
			filtered = searchPosts(query).filter((post) => post.status === 'published');
		}
		if (tagId) {
			filtered = getPostsByTag(tagId).filter((post) => post.status === 'published');
		}
		if (query && tagId) {
			filtered = filtered.filter(
				(post) =>
					post.title.toLowerCase().includes(query.toLowerCase()) ||
					post.content.toLowerCase().includes(query.toLowerCase()),
			);
		}
		setFilteredPosts(filtered);
		setCurrentPage(1);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
		filterPosts(query, selectedTag);
	};

	const handleTagFilter = (tagId: string) => {
		setSelectedTag(tagId);
		filterPosts(searchQuery, tagId);
	};

	const debounce = (func: (...args: any[]) => void, delay: number) => {
		let timeoutId: NodeJS.Timeout;
		return (...args: any[]) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func(...args), delay);
		};
	};

	const debouncedSearch = useMemo(() => debounce(handleSearch, 300), []);

	const paginatedPosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const handleCardClick = (postId: string) => {
		history.push(`/he-thong-ung-dung-blog-ca-nhan/trang-chi-tiet-bai-viet/${postId}`);
	};

	return (
		<div>
			<Search
				placeholder='Tìm kiếm bài viết...'
				onChange={(e) => debouncedSearch(e.target.value)}
				style={{ marginBottom: 16 }}
			/>
			<div style={{ marginBottom: 16 }}>
				<Tag color={selectedTag === '' ? 'blue' : ''} onClick={() => handleTagFilter('')} style={{ cursor: 'pointer' }}>
					Tất cả
				</Tag>
				{tags.map((tag) => (
					<Tag
						key={tag.id}
						color={selectedTag === tag.id ? 'blue' : ''}
						onClick={() => handleTagFilter(tag.id)}
						style={{ cursor: 'pointer' }}
					>
						{tag.name}
					</Tag>
				))}
			</div>
			<Row gutter={16}>
				{paginatedPosts.map((post) => (
					<Col span={8} key={post.id}>
						<Card
							hoverable
							cover={<img alt={post.title} src={post.thumbnail} />}
							onClick={() => handleCardClick(post.id)}
						>
							<Card.Meta title={post.title} description={post.content.substring(0, 100) + '...'} />
							<div style={{ marginTop: 8 }}>
								<span>
									{post.author} - {new Date(post.createdAt).toLocaleDateString()}
								</span>
							</div>
							<div style={{ marginTop: 8 }}>
								{post.tags.map((tagId) => {
									const tag = tags.find((t) => t.id === tagId);
									return tag ? <Tag key={tagId}>{tag.name}</Tag> : null;
								})}
							</div>
						</Card>
					</Col>
				))}
			</Row>
			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={filteredPosts.length}
				onChange={(page) => setCurrentPage(page)}
				style={{ marginTop: 16, textAlign: 'center' }}
			/>
		</div>
	);
};

export default TrangChu;
