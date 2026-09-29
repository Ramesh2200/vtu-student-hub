package com.vtuconnect.util;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility for generating standard, fully compliant PDF-1.4 binary documents
 * with mathematically exact cross-reference (xref) table offsets.
 */
public class PdfGeneratorUtil {

    public static byte[] generateAcademicPdf(String title, String subtitle, List<String> contentLines) {
        String cleanTitle = (title != null ? title : "VTU Academic Document").replaceAll("[()\r\n]", " ");
        String cleanSubtitle = (subtitle != null ? subtitle : "Visvesvaraya Technological University").replaceAll("[()\r\n]", " ");

        StringBuilder stream = new StringBuilder();
        stream.append("BT\n");
        stream.append("/F1 18 Tf\n");
        stream.append("40 740 Td\n");
        stream.append("(").append(cleanTitle).append(") Tj\n");
        stream.append("0 -24 Td\n");
        stream.append("/F2 11 Tf\n");
        stream.append("(").append(cleanSubtitle).append(") Tj\n");
        stream.append("0 -30 Td\n");
        stream.append("/F2 10 Tf\n");

        if (contentLines != null) {
            for (String line : contentLines) {
                String cleanLine = line.replaceAll("[()\r\n]", " ");
                stream.append("(").append(cleanLine).append(") Tj\n");
                stream.append("0 -18 Td\n");
            }
        }
        stream.append("ET\n");

        byte[] streamBytes = stream.toString().getBytes(StandardCharsets.ISO_8859_1);
        int streamLen = streamBytes.length;

        byte[] header = "%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n".getBytes(StandardCharsets.ISO_8859_1);

        byte[] obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1);
        byte[] obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1);
        byte[] obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1);

        String obj4HeaderStr = "4 0 obj\n<< /Length " + streamLen + " >>\nstream\n";
        byte[] obj4Header = obj4HeaderStr.getBytes(StandardCharsets.ISO_8859_1);
        byte[] obj4Footer = "\nendstream\nendobj\n".getBytes(StandardCharsets.ISO_8859_1);

        byte[] obj5 = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1);
        byte[] obj6 = "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n".getBytes(StandardCharsets.ISO_8859_1);

        int obj4TotalLen = obj4Header.length + streamBytes.length + obj4Footer.length;

        List<Integer> offsets = new ArrayList<>();
        int curr = header.length;

        offsets.add(curr); // obj1
        curr += obj1.length;

        offsets.add(curr); // obj2
        curr += obj2.length;

        offsets.add(curr); // obj3
        curr += obj3.length;

        offsets.add(curr); // obj4
        curr += obj4TotalLen;

        offsets.add(curr); // obj5
        curr += obj5.length;

        offsets.add(curr); // obj6
        curr += obj6.length;

        int xrefOffset = curr;

        StringBuilder xref = new StringBuilder();
        xref.append("xref\n0 7\n0000000000 65535 f \n");
        for (int o : offsets) {
            xref.append(String.format("%010d 00000 n \n", o));
        }

        StringBuilder trailer = new StringBuilder();
        trailer.append("trailer\n<< /Size 7 /Root 1 0 R >>\n");
        trailer.append("startxref\n").append(xrefOffset).append("\n%%EOF\n");

        byte[] xrefBytes = xref.toString().getBytes(StandardCharsets.ISO_8859_1);
        byte[] trailerBytes = trailer.toString().getBytes(StandardCharsets.ISO_8859_1);

        int totalSize = curr + xrefBytes.length + trailerBytes.length;
        byte[] pdf = new byte[totalSize];

        int destPos = 0;
        System.arraycopy(header, 0, pdf, destPos, header.length); destPos += header.length;
        System.arraycopy(obj1, 0, pdf, destPos, obj1.length); destPos += obj1.length;
        System.arraycopy(obj2, 0, pdf, destPos, obj2.length); destPos += obj2.length;
        System.arraycopy(obj3, 0, pdf, destPos, obj3.length); destPos += obj3.length;

        System.arraycopy(obj4Header, 0, pdf, destPos, obj4Header.length); destPos += obj4Header.length;
        System.arraycopy(streamBytes, 0, pdf, destPos, streamBytes.length); destPos += streamBytes.length;
        System.arraycopy(obj4Footer, 0, pdf, destPos, obj4Footer.length); destPos += obj4Footer.length;

        System.arraycopy(obj5, 0, pdf, destPos, obj5.length); destPos += obj5.length;
        System.arraycopy(obj6, 0, pdf, destPos, obj6.length); destPos += obj6.length;
        System.arraycopy(xrefBytes, 0, pdf, destPos, xrefBytes.length); destPos += xrefBytes.length;
        System.arraycopy(trailerBytes, 0, pdf, destPos, trailerBytes.length);

        return pdf;
    }
}
