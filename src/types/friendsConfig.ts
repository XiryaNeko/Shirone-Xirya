import type { PageMeta } from "./pageMeta.ts";

<<<<<<< HEAD
export interface FriendsConfig extends PageMeta {}
=======
export interface FriendsConfig extends PageMeta {
	/** 每页条数；省略或无效值回退 12。 */
	pageSize?: number;
}
>>>>>>> upstream/main
