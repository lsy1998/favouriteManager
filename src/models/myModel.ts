export interface linkItem{
    type?:string,
    linkTitle:string,
    link:string,
    linkId?:string,
}


export interface item{
    type?:string,
    folderName?:string,
    linkTitle?:string,
    link?:string,
    data?:item[],
    folderId?:number,
    linkId?:number,
    parentFolderId?:number,
}

// export interface dbItem{
//   folderName?:string,
//   folderId?:number,
//   parentFolderId?:number,
//   folderAddDate?:Date,
//   folderModifiedDate?:Date,
//   linkName?:string,
//   linkAddDate?:Date,
//   linkModifiedDate?:Date,
//   linkId?:number,
//   linkUrl?:string,
// }
export interface dbItem{
  FOLDER_NAME?:string,
  FOLDER_ID?:number,
  PARENT_FOLDER_ID?:number,
  FOLDER_ADD_DATA?:Date,
  FOLDRE_MODIFIED_DATE?:Date,
  LINK_NAME?:string,
  LINK_ADD_DATE?:Date,
  LINK_MODIFIED_DATE?:Date,
  LINK_ID?:number,
  LINK_URL?:string,
}
