export interface linkItem{
    type?:string,
    linkTitle:string,
    link:string,
}

export interface item{
    type?:string,
    folderName?:string,
    linkTitle?:string,
    link?:string,
    data?:item[]
}
