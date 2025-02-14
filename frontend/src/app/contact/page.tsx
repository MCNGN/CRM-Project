import Image from "next/image";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  


export default function Contact() {
  return (
    <Table >
        <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>E-mail</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>AAAAA</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>BBBBB</TableCell>
            </TableRow>
        </TableBody>
    </Table>
  );
}
