import { MouseEventHandler } from "react"
import { CategorySelect } from "./state"

export type WebEntryType = {
  id: string,
  logo: string,
  alt: string,
  url: string
}

export type WebEntryProps = {
  id: string,
  logo: string,
  url: string,
  alt: string,
  getWebs : Function
}

export type CategoryBoxProps = {
  id: string,
  image: string,
  alt: string
}
export type CategoryBoxFilterProps = {
  id: string,
  image: string,
  alt: string,
  onClick: MouseEventHandler
}
export type CategoryRowProps = {
  id: string,
  image: string,
  alt: string,
  getCategories: Function
}

export type ProjectBoxProps = {
  id: string,
  image: string,
  name: string,
  description: string
  url: string
  categories: CategoryBoxProps[]
}

export type ProjectRowProps = {
  id: string,
  image: string,
  name: string,
  description: string
  categories: CategoryBoxProps[]
  url: string
  categoriesList: CategorySelect[]
  getProject: Function
}

export type ContactFormProps = {
  hideContact: MouseEventHandler
}

export type NavbarProps = {
  showContact: MouseEventHandler
  responsive: boolean
  toggle?: boolean
}

export type CardProps = {
  name: string,
  image: string,
  url: string,
  description: string,
  categories: CategoryBoxProps[]
}

export type CurriculumEntryProps = {
  id: string,
  startDate: string,
  endDate: string,
  occupation: string,
  society:string
}

export type CurriculumRowProps = {
  id: string,
  startDate: string,
  endDate: string,
  occupation: string,
  society: string,
  getCurriculae: Function
}