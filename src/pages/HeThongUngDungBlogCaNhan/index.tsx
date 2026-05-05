import React, { useState, useEffect, useMemo } from 'react';
import { Card, Pagination, Input, Tag, Row, Col } from 'antd';
import { useHistory } from 'umi';
import type { Post, Tag as TagInterface } from '@/models/ungdungblogcanhan';
import { loadPosts, loadTags } from '@/models/ungdungblogcanhan';

const { Search } = Input;

const TrangChu: React.FC = () => {
	const history = useHistory();
	const [posts, setPosts] = useState<Post[]>([]);
	const [tags, setTags] = useState<TagInterface[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [selectedTag, setSelectedTag] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 9;

	const filterPosts = (query: string, tagId: string) => {
		let filtered = posts.filter((post: Post) => post.status === 'published');
		if (query) {
			filtered = filtered.filter(
				(post: Post) =>
					post.title.toLowerCase().includes(query.toLowerCase()) ||
					post.content.toLowerCase().includes(query.toLowerCase()),
			);
		}
		if (tagId) {
			filtered = filtered.filter((post: Post) => post.tags.includes(tagId));
		}
		setFilteredPosts(filtered);
		setCurrentPage(1);
	};

	useEffect(() => {
		const loadedPosts = loadPosts();
		const loadedTags = loadTags();
		setPosts(loadedPosts);
		setTags(loadedTags);
		setFilteredPosts(loadedPosts.filter((post: Post) => post.status === 'published'));
	}, []);

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
				{paginatedPosts.map((post: Post) => (
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
								{(post.tags || []).map((tagId: string) => {
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
