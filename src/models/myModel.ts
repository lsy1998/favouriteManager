export interface linkItem {
  type?: string,
  linkTitle: string,
  link: string,
  linkId?: string,
}


export interface item {
  type?: string,
  folderName?: string,
  linkTitle?: string,
  link?: string,
  data?: item[],
  folderId?: string,
  linkId?: string,
  parentFolderId?: string,
}

export interface dbItem {
  FOLDER_NAME?: string,
  FOLDER_ID?: number,
  PARENT_FOLDER_ID?: number,
  FOLDER_ADD_DATA?: Date,
  FOLDRE_MODIFIED_DATE?: Date,
  LINK_NAME?: string,
  LINK_ADD_DATE?: Date,
  LINK_MODIFIED_DATE?: Date,
  LINK_ID?: number,
  LINK_URL?: string,
}

export interface edgeBookmark {
  children?: edgeBookmark[],
  date_added?: string,
  date_last_used?: string,
  date_modified?: string,
  guid?: string,
  id?: string,
  name?: string,
  source?: string,
  type?: string,
  url?: string,
}

export interface dbFMDItem {
  id?: number,
  folderName?: string,
  folderId?: string,
  folderAddDate?: string,
  folderModifiedDate?: string,
  linkName?: string,
  linkId?: string,
  linkUrl?: string,
  linkAddDate?: string,
  linkModifiedDate?: string,
  parentFolderId?: string,
}
