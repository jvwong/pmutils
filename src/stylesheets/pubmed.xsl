<?xml version="1.0" encoding="utf-8"?>
<!-- pubmed.xsl -->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xs="http://www.w3.org/2001/XMLSchema"
                version="2.0">

  <xsl:output method="html"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>PubMedArticle Extraction</title>
      </head>
      <body style="font-family: sans-serif;">
        <table border="1px">
          <tr>
            <th>Volume</th>
            <th>Issue</th>
            <th>Journal</th>
            <th>Title</th>
            <th>Accepted</th>
            <th>PubMed</th>
            <th>pmid</th>
            <th>doi</th>
          </tr>
          <xsl:apply-templates select="/PubmedArticleSet/PubmedArticle"/>
        </table>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="PubmedArticle">
    <tr>
      <xsl:apply-templates select="MedlineCitation"/>
      <xsl:apply-templates select="PubmedData"/>
    </tr>
  </xsl:template>

  <xsl:template match="MedlineCitation">
    <xsl:apply-templates select="Article"/>
  </xsl:template>

  <xsl:template match="Article">
    <xsl:apply-templates select="Journal"/>
    <td>
      <xsl:value-of select="ArticleTitle"/>
    </td>
  </xsl:template>

  <xsl:template match="Journal">
    <td>
      <xsl:value-of select="JournalIssue/Volume"/>
    </td>
    <td>
      <xsl:value-of select="JournalIssue/Issue"/>
    </td>
    <td>
      <xsl:value-of select="ISOAbbreviation"/>
    </td>
  </xsl:template>

  <xsl:template match="PubmedData">
    <xsl:apply-templates select="History"/>
    <xsl:apply-templates select="ArticleIdList"/>
  </xsl:template>

  <xsl:template match="History">
    <xsl:variable name="numPubmedDate" select="count(PubMedPubDate[@PubStatus='pubmed'])"/>
    <xsl:variable name="numAcceptedDate" select="count(PubMedPubDate[@PubStatus='accepted'])"/>
    <xsl:choose>
      <xsl:when test="$numAcceptedDate > 0">
        <xsl:apply-templates select="PubMedPubDate[@PubStatus='accepted']"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="default-cell"/>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:choose>
      <xsl:when test="$numPubmedDate > 0">
        <xsl:apply-templates select="PubMedPubDate[@PubStatus='pubmed']"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="default-cell"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="PubMedPubDate">
    <xsl:call-template name="pub-date"/>
  </xsl:template>

  <xsl:template name="pub-date">
    <xsl:variable name="year" select="Year"/>
    <xsl:variable name="month" select="Month"/>
    <xsl:variable name="day" select="Day"/>
    <xsl:variable name="date"
      select="xs:date(string-join(($year, format-number($month, '00'), format-number($day, '00')),'-'))"
      as="xs:date" />
    <td>
      <xsl:value-of select="$date"/>
      <!-- <xsl:value-of select="format-date(xs:date($date), '[Y0001]-[D]-[D01]')"/> -->
    </td>
  </xsl:template>

  <xsl:template name="default-cell">
    <td>
      <xsl:value-of select="''"/>
    </td>
  </xsl:template>

  <xsl:template match="ArticleIdList">
    <xsl:apply-templates select="ArticleId"/>
  </xsl:template>

  <xsl:template name="article-id-link">
    <xsl:param name="base-url"/>
    <xsl:variable name="id" as="xs:string" select="."/>
    <xsl:element name="a">
      <xsl:attribute name="href">
        <xsl:value-of select="concat($base-url,$id)"/>
      </xsl:attribute>
      <xsl:value-of select="$id" />
    </xsl:element>
  </xsl:template>

  <xsl:template match="ArticleId">
    <xsl:variable name="base-url" as="xs:string">
      <xsl:choose>
        <xsl:when test="@IdType='pubmed'">
          <xsl:text>https://www.ncbi.nlm.nih.gov/pubmed/</xsl:text>
        </xsl:when>
        <xsl:when test="@IdType='doi'">
          <xsl:text>https://doi.org/</xsl:text>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text></xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:if test="$base-url !=''">
      <td>
        <xsl:call-template name="article-id-link">
          <xsl:with-param name="base-url" select="$base-url"/>
        </xsl:call-template>
      </td>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>