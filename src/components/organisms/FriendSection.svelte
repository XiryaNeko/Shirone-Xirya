<script lang="ts">
import Chips from "@components/atoms/action/Chips.svelte";
import Card from "@components/atoms/display/Card.svelte";
<<<<<<< HEAD
import LoadingIndicator from "@components/atoms/feedback/LoadingIndicator.svelte";
import TextField from "@components/atoms/input/TextField.svelte";
import FriendCard from "@components/molecules/FriendCard.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
=======
import Icon from "@components/atoms/display/Icon.svelte";
import TextField from "@components/atoms/input/TextField.svelte";
import FriendCard from "@components/molecules/FriendCard.svelte";
import ListPagination from "@components/molecules/ListPagination.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { createListHistory } from "@utils/list-history";
import { reveal } from "@utils/motion";
import { normalizePage, normalizePageSize } from "@utils/pagination";
>>>>>>> upstream/main
import { onMount } from "svelte";
import type { FriendItem } from "../../data/friends";

let {
	friends = [] as FriendItem[],
	title = i18n(I18nKey.friends),
	subtitle = i18n(I18nKey.friendsBanner),
<<<<<<< HEAD
=======
	pageSize = 12,
>>>>>>> upstream/main
}: {
	friends?: FriendItem[];
	title?: string;
	subtitle?: string;
<<<<<<< HEAD
=======
	pageSize?: number;
>>>>>>> upstream/main
} = $props();

let query = $state("");
let selectedTag = $state("");
<<<<<<< HEAD
let initialized = false;
/** 标签筛选过渡三段态：loading 展示指示器 → out 指示器淡出 → idle 列表揭幕（与动态页同语言） */
type FilterPhase = "idle" | "loading" | "out";
let phase = $state<FilterPhase>("idle");
let phaseTimers: ReturnType<typeof setTimeout>[] = [];
=======
let page = $state(1);
let mounted = $state(false);
let toolsEl = $state<HTMLElement | null>(null);
>>>>>>> upstream/main

const tagItems = $derived(
	Array.from(new Set(friends.flatMap((friend) => friend.tags)))
		.sort((a, b) => a.localeCompare(b))
		.map((tag) => ({ value: tag, label: tag })),
);

const filtered = $derived.by(() => {
	const normalizedQuery = query.trim().toLowerCase();

	return friends.filter((friend) => {
		if (selectedTag && !friend.tags.includes(selectedTag)) return false;
		if (!normalizedQuery) return true;

		let searchableHost = friend.siteurl;
		try {
			searchableHost = new URL(friend.siteurl).hostname;
		} catch {
			/* Keep the original URL when it cannot be parsed. */
		}

		return [friend.title, friend.desc, searchableHost, ...friend.tags].some(
			(value) => value.toLowerCase().includes(normalizedQuery),
		);
	});
});

<<<<<<< HEAD
=======
const size = $derived(normalizePageSize(pageSize));
const totalPages = $derived(Math.ceil(filtered.length / size));
const currentPage = $derived(normalizePage(page, totalPages));
const visibleItems = $derived(
	filtered.slice((currentPage - 1) * size, currentPage * size),
);
>>>>>>> upstream/main
const visibleCount = $derived(filtered.length);

function countLabel(count: number) {
	return `${count} ${i18n(count === 1 ? I18nKey.friendsCount : I18nKey.friendsCounts)}`;
}

<<<<<<< HEAD
/** 标签筛选：指示器展示 → 淡出 → 列表重新揭幕（与动态页同语言） */
function onTagChange() {
	phaseTimers.forEach(clearTimeout);
	phase = "loading";
	phaseTimers = [
		setTimeout(() => (phase = "out"), 300),
		setTimeout(() => (phase = "idle"), 300 + 150),
	];
}

// 筛选状态同步到 URL（?q= / ?tag=），刷新/分享/回退保留
$effect(() => {
	// 先读依赖（无论是否初始化都注册），避免首次 return 后不再追踪
	const q = query;
	const t = selectedTag;
	if (!initialized) return;
	const params = new URLSearchParams(window.location.search);
	params.delete("q");
	params.delete("tag");
	if (q) params.set("q", q);
	if (t) params.set("tag", t);
	const qs = params.toString();
	history.replaceState(
		history.state,
		"",
		qs ? `?${qs}` : window.location.pathname,
	);
});

onMount(() => {
	const params = new URLSearchParams(window.location.search);
	query = params.get("q") || "";
	selectedTag = params.get("tag") || "";
	initialized = true;
	return () => phaseTimers.forEach(clearTimeout);
=======
const listHistory = createListHistory({
	read: (params) => {
		query = params.get("q") || "";
		selectedTag = params.get("tag") || "";
		page = normalizePage(params.get("page"), totalPages);
	},
	write: (params) => {
		for (const key of ["q", "tag", "page"]) params.delete(key);
		if (query.trim()) params.set("q", query.trim());
		if (selectedTag) params.set("tag", selectedTag);
		if (currentPage > 1) params.set("page", String(currentPage));
	},
	element: () => toolsEl,
});
function setQuery(value: string) {
	query = value;
	page = 1;
	listHistory.replace();
}
function setFilter(value: string) {
	selectedTag = value;
	page = 1;
	listHistory.replace();
}
function changePage(value: number) {
	const next = normalizePage(value, totalPages);
	if (next === currentPage) return;
	page = next;
	listHistory.push();
	listHistory.scroll();
}

onMount(() => {
	mounted = true;
	const disconnect = listHistory.connect();
	listHistory.replace();
	return disconnect;
>>>>>>> upstream/main
});
</script>

<Card color="var(--card-bg)" radius="l" class="friend-section px-8 py-6">
	<PageHeader
		icon="material-symbols:handshake-outline-rounded"
		{title}
		{subtitle}
	/>

	{#if friends.length > 0}
<<<<<<< HEAD
		<div class="friend-section__tools">
			<div class="friend-section__search">
				<TextField
					type="search"
					bind:value={query}
=======
		<div class="friend-section__tools" bind:this={toolsEl} tabindex="-1">
			<div class="friend-section__search">
				<TextField
					type="search"
					bind:value={() => query, setQuery}
>>>>>>> upstream/main
					placeholder={i18n(I18nKey.search)}
					label={i18n(I18nKey.search)}
					hideLabel
					variant="outlined"
					class="!rounded-(--shape-corner-l)"
				>
					<Icon slot="leading" icon="material-symbols:search-rounded" aria-hidden="true" />
				</TextField>
				{#if query}
					<button
						type="button"
						class="friend-section__search-clear"
						aria-label={i18n(I18nKey.clear)}
<<<<<<< HEAD
						onclick={() => (query = "")}
=======
						onclick={() => setQuery("")}
>>>>>>> upstream/main
					>
						<Icon icon="material-symbols:close-rounded" aria-hidden="true" />
					</button>
				{/if}
			</div>

			{#if tagItems.length > 0}
				<div class="friend-section__chips">
					<Chips
						items={tagItems}
						variant="filter"
<<<<<<< HEAD
						bind:value={selectedTag}
						onchange={onTagChange}
=======
						bind:value={() => selectedTag, setFilter}
>>>>>>> upstream/main
					/>
				</div>
			{/if}
			<p class="friend-section__count">{countLabel(visibleCount)}</p>
		</div>
	{/if}

<<<<<<< HEAD
	{#if phase !== "idle"}
		<!-- 标签筛选过渡：contained 指示器展示后淡出，再由列表揭幕（与动态页同语言） -->
		<div
			class="friend-section__loading"
			class:friend-section__loading--out={phase === "out"}
		>
			<LoadingIndicator contained size={64} />
		</div>
	{:else if filtered.length > 0}
		{#key `${query}|${selectedTag}`}
			<div class="friend-section__list">
				{#each filtered as friend (friend.id)}
=======
	{#if visibleItems.length > 0}
		{#key JSON.stringify([query, selectedTag, currentPage])}
			<div class="friend-section__list" use:reveal>
				{#each visibleItems as friend (friend.id)}
>>>>>>> upstream/main
					<FriendCard {friend} />
				{/each}
			</div>
		{/key}
<<<<<<< HEAD
=======
		{#if !mounted && filtered.length > size}
			<noscript>
				<div class="friend-section__list">
					{#each filtered.slice(size) as friend (friend.id)}
						<FriendCard {friend} />
					{/each}
				</div>
			</noscript>
		{/if}
>>>>>>> upstream/main
	{:else}
		<div class="friend-section__empty">
			<Icon icon="material-symbols:search-off-outline-rounded" aria-hidden="true" />
			<span>{i18n(I18nKey.friendsNoResults)}</span>
		</div>
	{/if}
<<<<<<< HEAD
=======
	{#if totalPages > 1}
		<div class="friend-section__pagination">
			<ListPagination {currentPage} {totalPages} onpagechange={changePage} />
		</div>
	{/if}
>>>>>>> upstream/main
</Card>

<style lang="stylus">
@import "../../styles/breakpoints.styl"

.friend-section
	display: block

	&__tools
		display: flex
		flex-direction: column
		gap: 0.875rem
		padding-bottom: 1.5rem
		border-bottom: 1px solid var(--outline-variant)

	&__search
		position: relative
		width: 100%
		max-width: 32rem

		:global(.m3-text-field)
			width: 100%

	&__search-clear
		position: absolute
		right: 0.5rem
		top: 50%
		transform: translateY(-50%)
		display: inline-flex
		flex-shrink: 0
		align-items: center
		justify-content: center
		width: 1.75rem
		height: 1.75rem
		padding: 0.25rem
		border: none
		background: none
		color: var(--on-surface-variant)
		cursor: pointer
		border-radius: var(--shape-corner-full)
		> :global(svg)
			width: 1.25rem
			height: 1.25rem
		&:hover
			background: unquote("color-mix(in oklab, var(--on-surface-variant) 8%, transparent)")

	&__chips
		width: 100%

	&__count
		margin: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)

<<<<<<< HEAD
	/* 标签筛选过渡：区块位置的大号 contained LoadingIndicator（out = 淡出退场，与动态页同语言） */
	&__loading
		display: flex
		align-items: center
		justify-content: center
		min-height: 11rem
		padding-top: 1.5rem

		&--out
			animation: friend-loading-out var(--m3e-duration-short) var(--m3e-easing-emphasized-accelerate) both
=======
	&__pagination
		margin-top: var(--m3e-space-6)
		min-height: 3rem
>>>>>>> upstream/main

	&__list
		display: grid
		grid-template-columns: 1fr
		gap: 1rem
		padding-top: 1.5rem
<<<<<<< HEAD
		animation: friend-fade-in var(--m3e-duration-medium) var(--m3e-easing-standard)
=======
>>>>>>> upstream/main

		@media (min-width: bp-md)
			grid-template-columns: repeat(2, 1fr)

	&__empty
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: 0.75rem
		min-height: 11rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-large)
		> :global(svg)
			width: 2.5rem
			height: 2.5rem

	@media (max-width: bp-sm - 1px)
		padding: 1rem 0.75rem

		&__list
			padding-top: 1.25rem

<<<<<<< HEAD
/* 筛选结果淡入（reduced-motion 由全局 motion-reduced 规则禁用动画） */
@keyframes friend-fade-in
	from
		opacity: 0
		transform: translateY(0.25rem)
	to
		opacity: 1
		transform: translateY(0)

/* 指示器退场：淡出 + 轻微收拢（reduced-motion 由全局规则压至终态） */
@keyframes friend-loading-out
	from
		opacity: 1
		transform: none
	to
		opacity: 0
		transform: scale(0.96)
=======
>>>>>>> upstream/main
</style>
