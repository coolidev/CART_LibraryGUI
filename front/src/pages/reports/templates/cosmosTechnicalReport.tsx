import { Report } from "..";

export const report: Report = {
  name: `CoSMOS Technical Report`,
  description: 'The CoSMOS Technical Report contains a general overview of all results of your analysis, including your network selection(s), mission parameters, coverage map, analytical charts, link budgets and performance results. ',
  fileType: 'DOCX',
  needsVisualizer: true,
  requiresResults: true,
  analyticsView: 'coverage',
  html: `<html xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns:dt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882"
  xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
  xmlns="http://www.w3.org/TR/REC-html40">
  
  <head>
  <meta http-equiv=Content-Type content="text/html; charset=windows-1252">
  <meta name=ProgId content=Word.Document>
  <meta name=Generator content="Microsoft Word 15">
  <meta name=Originator content="Microsoft Word 15">
  <link rel=File-List href="new_files/filelist.xml">
  <link rel=Edit-Time-Data href="new_files/editdata.mso">
  <!--[if !mso]>
  <style>
  v\:* {behavior:url(#default#VML);}
  o\:* {behavior:url(#default#VML);}
  w\:* {behavior:url(#default#VML);}
  .shape {behavior:url(#default#VML);}
  </style>
  <![endif]--><!--[if gte mso 9]><xml>
   <o:DocumentProperties>
    <o:Author>Ian Schrock</o:Author>
    <o:LastAuthor>Michael Hopper</o:LastAuthor>
    <o:Revision>9</o:Revision>
    <o:TotalTime>146</o:TotalTime>
    <o:Created>2021-12-16T20:32:00Z</o:Created>
    <o:LastSaved>2021-12-21T21:48:00Z</o:LastSaved>
    <o:Pages>6</o:Pages>
    <o:Words>489</o:Words>
    <o:Characters>2788</o:Characters>
    <o:Lines>23</o:Lines>
    <o:Paragraphs>6</o:Paragraphs>
    <o:CharactersWithSpaces>3271</o:CharactersWithSpaces>
    <o:Version>16.00</o:Version>
   </o:DocumentProperties>
   <o:CustomDocumentProperties>
    <o:ContentTypeId dt:dt="string">0x010100F340B9D8CA4CAC4E9797CF61C26E06CB</o:ContentTypeId>
   </o:CustomDocumentProperties>
  </xml><![endif]-->
  <link rel=themeData href="new_files/themedata.thmx">
  <link rel=colorSchemeMapping href="new_files/colorschememapping.xml">
  <!--[if gte mso 9]><xml>
   <w:WordDocument>
    <w:SpellingState>Clean</w:SpellingState>
    <w:GrammarState>Clean</w:GrammarState>
    <w:TrackMoves>false</w:TrackMoves>
    <w:TrackFormatting/>
    <w:PunctuationKerning/>
    <w:ValidateAgainstSchemas/>
    <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
    <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
    <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
    <w:DoNotPromoteQF/>
    <w:LidThemeOther>EN-US</w:LidThemeOther>
    <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
    <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
    <w:Compatibility>
     <w:BreakWrappedTables/>
     <w:SnapToGridInCell/>
     <w:WrapTextWithPunct/>
     <w:UseAsianBreakRules/>
     <w:DontGrowAutofit/>
     <w:SplitPgBreakAndParaMark/>
     <w:EnableOpenTypeKerning/>
     <w:DontFlipMirrorIndents/>
     <w:OverrideTableStyleHps/>
     <w:UseFELayout/>
    </w:Compatibility>
    <w:DoNotOptimizeForBrowser/>
    <m:mathPr>
     <m:mathFont m:val="Cambria Math"/>
     <m:brkBin m:val="before"/>
     <m:brkBinSub m:val="&#45;-"/>
     <m:smallFrac m:val="off"/>
     <m:dispDef/>
     <m:lMargin m:val="0"/>
     <m:rMargin m:val="0"/>
     <m:defJc m:val="centerGroup"/>
     <m:wrapIndent m:val="1440"/>
     <m:intLim m:val="subSup"/>
     <m:naryLim m:val="undOvr"/>
    </m:mathPr></w:WordDocument>
  </xml><![endif]--><!--[if gte mso 9]><xml>
   <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
    DefSemiHidden="false" DefQFormat="false" DefPriority="99"
    LatentStyleCount="376">
    <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>
    <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>
    <w:LsdException Locked="false" Priority="9" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 7"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 8"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index 9"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 1"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 2"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 3"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 4"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 5"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 6"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 7"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 8"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" Name="toc 9"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Normal Indent"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="footnote text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="annotation text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="header"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="footer"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="index heading"/>
    <w:LsdException Locked="false" Priority="35" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="caption"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="table of figures"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="envelope address"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="envelope return"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="footnote reference"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="annotation reference"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="line number"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="page number"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="endnote reference"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="endnote text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="table of authorities"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="macro"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="toa heading"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Bullet"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Number"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Bullet 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Bullet 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Bullet 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Bullet 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Number 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Number 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Number 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Number 5"/>
    <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Closing"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Signature"/>
    <w:LsdException Locked="false" Priority="1" SemiHidden="true"
     UnhideWhenUsed="true" Name="Default Paragraph Font"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text Indent"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Continue"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Continue 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Continue 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Continue 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="List Continue 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Message Header"/>
    <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Salutation"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Date"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text First Indent"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text First Indent 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Note Heading"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text Indent 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Body Text Indent 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Block Text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Hyperlink"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="FollowedHyperlink"/>
    <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>
    <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Document Map"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Plain Text"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="E-mail Signature"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Top of Form"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Bottom of Form"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Normal (Web)"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Acronym"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Address"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Cite"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Code"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Definition"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Keyboard"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Preformatted"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Sample"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Typewriter"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="HTML Variable"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Normal Table"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="annotation subject"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="No List"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Outline List 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Outline List 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Outline List 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Simple 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Simple 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Simple 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Classic 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Classic 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Classic 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Classic 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Colorful 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Colorful 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Colorful 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Columns 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Columns 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Columns 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Columns 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Columns 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 7"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Grid 8"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 4"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 5"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 7"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table List 8"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table 3D effects 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table 3D effects 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table 3D effects 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Contemporary"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Elegant"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Professional"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Subtle 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Subtle 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Web 1"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Web 2"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Web 3"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Balloon Text"/>
    <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Table Theme"/>
    <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>
    <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>
    <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>
    <w:LsdException Locked="false" Priority="34" QFormat="true"
     Name="List Paragraph"/>
    <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>
    <w:LsdException Locked="false" Priority="30" QFormat="true"
     Name="Intense Quote"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>
    <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>
    <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>
    <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>
    <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>
    <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>
    <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>
    <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>
    <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>
    <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>
    <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>
    <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>
    <w:LsdException Locked="false" Priority="19" QFormat="true"
     Name="Subtle Emphasis"/>
    <w:LsdException Locked="false" Priority="21" QFormat="true"
     Name="Intense Emphasis"/>
    <w:LsdException Locked="false" Priority="31" QFormat="true"
     Name="Subtle Reference"/>
    <w:LsdException Locked="false" Priority="32" QFormat="true"
     Name="Intense Reference"/>
    <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>
    <w:LsdException Locked="false" Priority="37" SemiHidden="true"
     UnhideWhenUsed="true" Name="Bibliography"/>
    <w:LsdException Locked="false" Priority="39" SemiHidden="true"
     UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>
    <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>
    <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>
    <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>
    <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>
    <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>
    <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>
    <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>
    <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>
    <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>
    <w:LsdException Locked="false" Priority="46"
     Name="Grid Table 1 Light Accent 1"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>
    <w:LsdException Locked="false" Priority="51"
     Name="Grid Table 6 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="52"
     Name="Grid Table 7 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="46"
     Name="Grid Table 1 Light Accent 2"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>
    <w:LsdException Locked="false" Priority="51"
     Name="Grid Table 6 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="52"
     Name="Grid Table 7 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="46"
     Name="Grid Table 1 Light Accent 3"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>
    <w:LsdException Locked="false" Priority="51"
     Name="Grid Table 6 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="52"
     Name="Grid Table 7 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="46"
     Name="Grid Table 1 Light Accent 4"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>
    <w:LsdException Locked="false" Priority="51"
     Name="Grid Table 6 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="52"
     Name="Grid Table 7 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="46"
     Name="Grid Table 1 Light Accent 5"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>
    <w:LsdException Locked="false" Priority="51"
     Name="Grid Table 6 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="52"
     Name="Grid Table 7 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="46"
     Name="Grid Table 1 Light Accent 6"/>
    <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>
    <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>
    <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>
    <w:LsdException Locked="false" Priority="51"
     Name="Grid Table 6 Colorful Accent 6"/>
    <w:LsdException Locked="false" Priority="52"
     Name="Grid Table 7 Colorful Accent 6"/>
    <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>
    <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>
    <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>
    <w:LsdException Locked="false" Priority="46"
     Name="List Table 1 Light Accent 1"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>
    <w:LsdException Locked="false" Priority="51"
     Name="List Table 6 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="52"
     Name="List Table 7 Colorful Accent 1"/>
    <w:LsdException Locked="false" Priority="46"
     Name="List Table 1 Light Accent 2"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>
    <w:LsdException Locked="false" Priority="51"
     Name="List Table 6 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="52"
     Name="List Table 7 Colorful Accent 2"/>
    <w:LsdException Locked="false" Priority="46"
     Name="List Table 1 Light Accent 3"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>
    <w:LsdException Locked="false" Priority="51"
     Name="List Table 6 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="52"
     Name="List Table 7 Colorful Accent 3"/>
    <w:LsdException Locked="false" Priority="46"
     Name="List Table 1 Light Accent 4"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>
    <w:LsdException Locked="false" Priority="51"
     Name="List Table 6 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="52"
     Name="List Table 7 Colorful Accent 4"/>
    <w:LsdException Locked="false" Priority="46"
     Name="List Table 1 Light Accent 5"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>
    <w:LsdException Locked="false" Priority="51"
     Name="List Table 6 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="52"
     Name="List Table 7 Colorful Accent 5"/>
    <w:LsdException Locked="false" Priority="46"
     Name="List Table 1 Light Accent 6"/>
    <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>
    <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>
    <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>
    <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>
    <w:LsdException Locked="false" Priority="51"
     Name="List Table 6 Colorful Accent 6"/>
    <w:LsdException Locked="false" Priority="52"
     Name="List Table 7 Colorful Accent 6"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Mention"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Smart Hyperlink"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Hashtag"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Unresolved Mention"/>
    <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
     Name="Smart Link"/>
   </w:LatentStyles>
  </xml><![endif]-->
  <style>
  <!--
   /* Font Definitions */
   @font-face
    {font-family:"Cambria Math";
    panose-1:2 4 5 3 5 4 6 3 2 4;
    mso-font-charset:0;
    mso-generic-font-family:roman;
    mso-font-pitch:variable;
    mso-font-signature:-536869121 1107305727 33554432 0 415 0;}
  @font-face
    {font-family:Calibri;
    panose-1:2 15 5 2 2 2 4 3 2 4;
    mso-font-charset:0;
    mso-generic-font-family:swiss;
    mso-font-pitch:variable;
    mso-font-signature:-469750017 -1073732485 9 0 511 0;}
   /* Style Definitions */
   p.MsoNormal, li.MsoNormal, div.MsoNormal
    {mso-style-unhide:no;
    mso-style-qformat:yes;
    mso-style-parent:"";
    margin-top:0in;
    margin-right:0in;
    margin-bottom:8.0pt;
    margin-left:0in;
    line-height:105%;
    mso-pagination:widow-orphan;
    font-size:11.0pt;
    font-family:"Calibri",sans-serif;
    mso-ascii-font-family:Calibri;
    mso-ascii-theme-font:minor-latin;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:minor-fareast;
    mso-hansi-font-family:Calibri;
    mso-hansi-theme-font:minor-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;}
  h1
    {mso-style-priority:9;
    mso-style-unhide:no;
    mso-style-qformat:yes;
    mso-style-link:"Heading 1 Char";
    mso-style-next:Normal;
    margin-top:12.0pt;
    margin-right:0in;
    margin-bottom:0in;
    margin-left:0in;
    line-height:105%;
    mso-pagination:widow-orphan lines-together;
    page-break-after:avoid;
    mso-outline-level:1;
    font-size:16.0pt;
    font-family:"Calibri Light",sans-serif;
    mso-ascii-font-family:"Calibri Light";
    mso-ascii-theme-font:major-latin;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:major-fareast;
    mso-hansi-font-family:"Calibri Light";
    mso-hansi-theme-font:major-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:major-bidi;
    mso-font-kerning:0pt;
    font-weight:normal;}
  p.MsoHeader, li.MsoHeader, div.MsoHeader
    {mso-style-noshow:yes;
    mso-style-priority:99;
    mso-style-link:"Header Char";
    margin:0in;
    mso-pagination:widow-orphan;
    tab-stops:center 3.25in right 6.5in;
    font-size:11.0pt;
    font-family:"Calibri",sans-serif;
    mso-ascii-font-family:Calibri;
    mso-ascii-theme-font:minor-latin;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:minor-fareast;
    mso-hansi-font-family:Calibri;
    mso-hansi-theme-font:minor-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;}
  p.MsoFooter, li.MsoFooter, div.MsoFooter
    {mso-style-noshow:yes;
    mso-style-priority:99;
    mso-style-link:"Footer Char";
    margin:0in;
    mso-pagination:widow-orphan;
    tab-stops:center 3.25in right 6.5in;
    font-size:11.0pt;
    font-family:"Calibri",sans-serif;
    mso-ascii-font-family:Calibri;
    mso-ascii-theme-font:minor-latin;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:minor-fareast;
    mso-hansi-font-family:Calibri;
    mso-hansi-theme-font:minor-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;}
  span.Heading1Char
    {mso-style-name:"Heading 1 Char";
    mso-style-priority:9;
    mso-style-unhide:no;
    mso-style-locked:yes;
    mso-style-link:"Heading 1";
    mso-ansi-font-size:16.0pt;
    mso-bidi-font-size:16.0pt;
    font-family:"Calibri Light",sans-serif;
    mso-ascii-font-family:"Calibri Light";
    mso-ascii-theme-font:major-latin;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:major-fareast;
    mso-hansi-font-family:"Calibri Light";
    mso-hansi-theme-font:major-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:major-bidi;}
  p.msonormal0, li.msonormal0, div.msonormal0
    {mso-style-name:msonormal;
    mso-style-unhide:no;
    mso-margin-top-alt:auto;
    margin-right:0in;
    mso-margin-bottom-alt:auto;
    margin-left:0in;
    mso-pagination:widow-orphan;
    font-size:12.0pt;
    font-family:"Times New Roman",serif;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:minor-fareast;}
  span.HeaderChar
    {mso-style-name:"Header Char";
    mso-style-noshow:yes;
    mso-style-priority:99;
    mso-style-unhide:no;
    mso-style-locked:yes;
    mso-style-link:Header;}
  span.FooterChar
    {mso-style-name:"Footer Char";
    mso-style-noshow:yes;
    mso-style-priority:99;
    mso-style-unhide:no;
    mso-style-locked:yes;
    mso-style-link:Footer;}
  span.SpellE
    {mso-style-name:"";
    mso-spl-e:yes;}
  span.GramE
    {mso-style-name:"";
    mso-gram-e:yes;}
  .MsoChpDefault
    {mso-style-type:export-only;
    mso-default-props:yes;
    font-size:10.0pt;
    mso-ansi-font-size:10.0pt;
    mso-bidi-font-size:10.0pt;
    font-family:"Calibri",sans-serif;
    mso-ascii-font-family:Calibri;
    mso-ascii-theme-font:minor-latin;
    mso-fareast-font-family:"Times New Roman";
    mso-fareast-theme-font:minor-fareast;
    mso-hansi-font-family:Calibri;
    mso-hansi-theme-font:minor-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;}
   /* Page Definitions */
   @page
    {mso-footnote-separator:url("new_files/header.html") fs;
    mso-footnote-continuation-separator:url("new_files/header.html") fcs;
    mso-footnote-continuation-notice:url("new_files/header.html") fcn;
    mso-endnote-separator:url("new_files/header.html") es;
    mso-endnote-continuation-separator:url("new_files/header.html") ecs;
    mso-endnote-continuation-notice:url("new_files/header.html") ecn;}
  @page WordSection1
    {size:8.5in 11.0in;
    margin:1.0in 1.0in 1.0in 1.0in;
    mso-header-margin:.5in;
    mso-footer-margin:.5in;
    mso-paper-source:0;}
  div.WordSection1
    {page:WordSection1;}
  -->
  </style>
  <!--[if gte mso 10]>
  <style>
   /* Style Definitions */
   table.MsoNormalTable
    {mso-style-name:"Table Normal";
    mso-tstyle-rowband-size:0;
    mso-tstyle-colband-size:0;
    mso-style-noshow:yes;
    mso-style-priority:99;
    mso-style-parent:"";
    mso-padding-alt:0in 5.4pt 0in 5.4pt;
    mso-para-margin:0in;
    mso-pagination:widow-orphan;
    font-size:10.0pt;
    font-family:"Calibri",sans-serif;
    mso-ascii-font-family:Calibri;
    mso-ascii-theme-font:minor-latin;
    mso-hansi-font-family:Calibri;
    mso-hansi-theme-font:minor-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;}
  table.MsoTableGrid
    {mso-style-name:"Table Grid";
    mso-tstyle-rowband-size:0;
    mso-tstyle-colband-size:0;
    mso-style-priority:39;
    mso-style-unhide:no;
    border:solid windowtext 1.0pt;
    mso-border-alt:solid windowtext .5pt;
    mso-padding-alt:0in 5.4pt 0in 5.4pt;
    mso-border-insideh:.5pt solid windowtext;
    mso-border-insidev:.5pt solid windowtext;
    mso-para-margin:0in;
    mso-pagination:widow-orphan;
    font-size:11.0pt;
    font-family:"Calibri",sans-serif;
    mso-ascii-font-family:Calibri;
    mso-ascii-theme-font:minor-latin;
    mso-fareast-font-family:Calibri;
    mso-fareast-theme-font:minor-latin;
    mso-hansi-font-family:Calibri;
    mso-hansi-theme-font:minor-latin;
    mso-bidi-font-family:"Times New Roman";
    mso-bidi-theme-font:minor-bidi;}
  </style>
  <![endif]--><!--[if gte mso 9]><xml>
   <o:shapedefaults v:ext="edit" spidmax="1026"/>
  </xml><![endif]--><!--[if gte mso 9]><xml>
   <o:shapelayout v:ext="edit">
    <o:idmap v:ext="edit" data="1"/>
   </o:shapelayout></xml><![endif]-->
  </head>
  
  <body lang=EN-US style='tab-interval:.5in;word-wrap:break-word'>
  
  <div class=WordSection1>
  
  <p class=MsoNormal><span style='font-size:12.0pt;line-height:105%;font-family:
  "Times New Roman",serif'>$$NASAFORMALTITLE$$<o:p></o:p></span></p>
  
  <p class=MsoNormal><span style='font-size:12.0pt;line-height:105%;font-family:
  "Times New Roman",serif'>$$SIGNATUREPAGE$$<o:p></o:p></span></p>
  
  <span style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
  "Times New Roman";mso-fareast-theme-font:minor-fareast;mso-ansi-language:EN-US;
  mso-fareast-language:EN-US;mso-bidi-language:AR-SA'><br clear=all
  style='mso-special-character:line-break;page-break-before:always'>
  </span>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:12.0pt;tab-stops:1.0in'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>To:
  <span style='mso-tab-count:1'>                  </span><span style='color:#4472C4;
  mso-themecolor:accent1'>Contact Name/Affiliation<br>
  <span style='mso-tab-count:1'>                        </span>Contact
  Name/Affiliation<o:p></o:p></span></span></p>
  
  <p class=MsoNormal style='margin-bottom:12.0pt;tab-stops:1.0in'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>From:<span
  style='mso-tab-count:1'>               </span><span style='color:#4472C4;
  mso-themecolor:accent1'>Contact Name/Affiliation</span><br>
  <span style='mso-tab-count:1'>                        </span><span
  style='color:#4472C4;mso-themecolor:accent1'>Contact Name/Affiliation<o:p></o:p></span></span></p>
  
  <p class=MsoNormal style='margin-left:1.0in;text-indent:-1.0in;tab-stops:1.0in'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>Subject:<span
  style='mso-tab-count:1'>           </span>$$NETWORKNAME$$ $$FREQUENCYBAND$$ Downlink
  for $$MISSIONNAME$$<o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$MISSIONDESCRIPTION$$<o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$REPORTDESCRIPTIONCONTENT$$<o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <span style='font-size:11.0pt;line-height:105%;font-family:"Times New Roman",serif;
  mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:minor-fareast;
  mso-ansi-language:EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'><br
  clear=all style='mso-special-character:line-break;page-break-before:always'>
  </span>
  
  <p class=MsoNormal><span style='font-size:16.0pt;line-height:105%;font-family:
  "Times New Roman",serif;mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:
  major-fareast'><o:p>&nbsp;</o:p></span></p>
  
  <h1 align=center style='text-align:center'><b><span style='font-family:"Times New Roman",serif'>Section
  1. Simulation Parameters<o:p></o:p></span></b></h1>
  
  <h1 align=center style='text-align:center'><span style='font-family:"Times New Roman",serif'>
  
  <hr size=2 width="100%" noshade style='color:black;mso-themecolor:text1'
  align=center>
  
  </span></h1>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif;color:red'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>Tables 1-1 through
  1-3 below show the general parameters selected for the simulation described in
  this document. Table 1-1 describes the mission parameters for the \"user\" of the
  selected network. Table 1-2 shows the desired link parameters defined in CoSMOS
  to facilitate communication between $$MISSIONNAME$$ and $$NETWORKNAME$$. Table
  1-3 provides parameters for the general structure of $$NETWORKNAME$$. A
  visualization of the coverage regions provided by $$NETWORKNAME$$ is shown in
  Figure 1-1.<o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Table
  1-1. Mission Parameters<o:p></o:p></span></b></p>
  
  <div align=center>
  
  <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
   style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext 2.25pt;
   mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt;mso-border-insideh:
   1.0pt solid windowtext;mso-border-insidev:1.0pt solid windowtext'>
   <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border:solid windowtext 1.5pt;
    border-right:solid windowtext 1.0pt;background:#BFBFBF;mso-background-themecolor:
    background1;mso-background-themeshade:191;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Characteristic<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border:solid windowtext 1.5pt;
    border-left:none;mso-border-left-alt:solid windowtext 1.0pt;background:#BFBFBF;
    mso-background-themecolor:background1;mso-background-themeshade:191;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;
    color:black;mso-color-alt:windowtext'>Value</span></b><span style='font-size:
    12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:Calibri;
    mso-fareast-theme-font:minor-latin'><o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:1;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.5pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Mission
    Type<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.5pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$ORBITALORTERR$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:2;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.0pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>$$ALTORLAT$$<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$ALTORLATVAL$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:3;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.0pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>$$INCORLONG$$<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$INCORLONGVAL$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:4;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.0pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Throughput
    <o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$THROUGHPUT$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:5;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.0pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Tolerable
    Gap in RF Coverage<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$TOLERABLEGAP$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:6;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.0pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Tracking
    Service Range Error Needed<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$TKNGSVCRNGERR$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:7;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border-top:none;border-left:
    solid windowtext 1.5pt;border-bottom:solid windowtext 1.0pt;border-right:
    solid windowtext 1.5pt;mso-border-top-alt:solid windowtext 1.0pt;padding:
    0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Mission
    Launch Year<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$LAUNCHYEAR$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:8;mso-yfti-lastrow:yes;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border:solid windowtext 1.5pt;
    border-top:none;mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Power
    Amplifier<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border-top:none;border-left:
    none;border-bottom:solid windowtext 1.5pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$POWERAMPLIFIER$$<o:p></o:p></span></p>
    </td>
   </tr>
  </table>
  
  </div>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></b></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Table
  1-2. Service Parameters<o:p></o:p></span></b></p>
  
  <div align=center>
  
  <table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
   style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext 2.25pt;
   mso-yfti-tbllook:1184;mso-padding-alt:0in 5.4pt 0in 5.4pt;mso-border-insideh:
   1.0pt solid windowtext;mso-border-insidev:1.0pt solid windowtext'>
   <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;height:.2in'>
    <td width=270 valign=top style='width:202.25pt;border:solid windowtext 1.5pt;
    border-right:solid windowtext 1.0pt;background:#BFBFBF;mso-background-themecolor:
    background1;mso-background-themeshade:191;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Characteristic<o:p></o:p></span></b></p>
    </td>
    <td width=156 valign=top style='width:117.0pt;border:solid windowtext 1.5pt;
    border-left:none;mso-border-left-alt:solid windowtext 1.0pt;background:#BFBFBF;
    mso-background-themecolor:background1;mso-background-themeshade:191;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin;
    color:black;mso-color-alt:windowtext'>Value</span></b><span style='font-size:
    12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:Calibri;
    mso-fareast-theme-font:minor-latin'><o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:1;height:.2in'>
    <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.5pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Network
    Type<o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.5pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$NETWORKTYPE$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:2;height:.2in'>
    <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Selected
    Systems<o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$SELECTEDSYSTEMS$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:3;height:.2in'>
    <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Frequency
    Band<o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$FREQUENCYBAND$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:4;height:.2in'>
    <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Modulation<o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$MODULATION$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:5;height:.2in'>
    <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Coding<o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$CODING$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:6;height:.2in'>
    <td width=270 style='width:202.25pt;border-top:none;border-left:solid windowtext 1.5pt;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Optimized
    <span class=SpellE>ModCod</span><o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.0pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$OPTIMIZEDMODCOD$$<o:p></o:p></span></p>
    </td>
   </tr>
   <tr style='mso-yfti-irow:7;mso-yfti-lastrow:yes;height:.2in'>
    <td width=270 style='width:202.25pt;border:solid windowtext 1.5pt;border-top:
    none;mso-border-top-alt:solid windowtext 1.0pt;padding:0in 5.4pt 0in 5.4pt;
    height:.2in'>
    <p class=MsoNormal align=right style='margin-bottom:0in;text-align:right;
    line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif;
    mso-fareast-font-family:Calibri;mso-fareast-theme-font:minor-latin'>Data Rate
    (kbps)<o:p></o:p></span></b></p>
    </td>
    <td width=156 style='width:117.0pt;border-top:none;border-left:none;
    border-bottom:solid windowtext 1.5pt;border-right:solid windowtext 1.5pt;
    mso-border-top-alt:solid windowtext 1.0pt;mso-border-left-alt:solid windowtext 1.5pt;
    padding:0in 5.4pt 0in 5.4pt;height:.2in'>
    <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
    style='font-size:12.0pt;font-family:"Times New Roman",serif;mso-fareast-font-family:
    Calibri;mso-fareast-theme-font:minor-latin'>$$INFORATE$$<o:p></o:p></span></p>
    </td>
   </tr>
  </table>
  
  </div>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$PAGEBREAK$$
  $$LINKSUMMARYTABLE$$ <o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></b></p>
  
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>$$VISUALIZER$$<o:p></o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Figure
  1-1. Coverage Visualization<o:p></o:p></span></b></p>
  
  <span style='font-size:11.0pt;line-height:105%;font-family:"Times New Roman",serif;
  mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:minor-fareast;
  mso-ansi-language:EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'><br
  clear=all style='mso-special-character:line-break;page-break-before:always'>
  </span>
  
  <p class=MsoNormal><span style='font-size:16.0pt;line-height:105%;font-family:
  "Times New Roman",serif;mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:
  major-fareast'><o:p>&nbsp;</o:p></span></p>
  
  <h1 align=center style='text-align:center'><b><span style='font-family:"Times New Roman",serif'>Section
  2. Performance Results<o:p></o:p></span></b></h1>
  
  <h1 align=center style='text-align:center'><b><span style='font-family:"Times New Roman",serif'>
  
  <hr size=2 width="100%" noshade style='color:black;mso-themecolor:text1'
  align=center>
  
  </span></b></h1>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>2.1 Coverage
  Performance<o:p></o:p></span></b></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>Section 2.1
  describes the expected communications performance resulting from the CoSMOS simulation
  parameters described in Section 1, assuming $$MISSIONNAME$$ will attempt to
  transmit data whenever coverage is present. Table 2-1 summarizes the
  communications results, while Figures 2-1 through 2-4 provide detailed charts
  describing coverage events from simulation data. <o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  class=GramE><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>In
  the event that</span></span><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>
  $$MISSIONNAME$$'s altitude and inclination does not match any of the reference
  missions used to construct <span class=SpellE>CoSMOS's</span> database, Figures
  2-1 through 2-4 display simulation data for the reference mission with altitude
  &amp; inclination values nearest to $$MISSIONNAME$$.<o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Table
  2-1. Performance Results Summary<o:p></o:p></span></b></p>
  
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>$$PERFORMANCEDATA$$<o:p></o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></b></p>
    
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>$$RFCOVERAGE$$<o:p></o:p></span></p>

  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Figure
  2-1. Coverage vs. Altitude<o:p></o:p></span></b></p>
  
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$PAGEBREAK$$<o:p></o:p></span></p>
    
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>$$COVERAGESTATS$$<o:p></o:p></span></p>

  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Figure
  2-2. Coverage Event Durations - Box &amp; Scatter Plot<o:p></o:p></span></b></p>
  
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
    
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>$$COVERAGEDISTRIBUTION$$<o:p></o:p></span></p>

  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Figure
  2-3. Coverage Event Durations - Histogram<o:p></o:p></span></b></p>
  
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$PAGEBREAK$$<o:p></o:p></span></p>
    
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'>$$COVERAGERUNNINGAVG$$<o:p></o:p></span></p>

  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Figure
  2-4. Coverage Event Durations - Running Average<o:p></o:p></span></b></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-family:"Times New Roman",serif'><br>
  </span><b><span style='font-size:14.0pt;font-family:"Times New Roman",serif'>2.2
  User Burden<o:p></o:p></span></b></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>Section 2.2 shows
  the predicted user burden required to achieve the communications performance
  described in Section 2.1. Table 2-2 shows the pointing rates that the mission
  must be capable of meeting <span class=GramE>in order to</span> maintain
  coverage. Slew Rate represents pointing speed which must be matched <span
  class=GramE>in order to</span> maintain service across satellite handoffs,
  while Tracking Rate represents the pointing speed that must be matched in order
  to maintain continuous service from a single relay. Table 2-3 shows the associated
  burden of various antenna options.<o:p></o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><b><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></b></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$USERBURDENDATA$$<o:p></o:p></span></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><b><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>Table
  2-3. Antenna Options Summary<o:p></o:p></span></b></p>
  
  <p class=MsoNormal align=center style='margin-bottom:0in;text-align:center;
  line-height:normal'><span style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$ANTENNAOPTIONSSUMMARY$$<o:p></o:p></span></p>
  
  <p class=MsoNormal align=center style='text-align:center'><span
  style='font-size:12.0pt;line-height:105%;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <p class=MsoNormal><span style='font-size:12.0pt;line-height:105%;font-family:
  "Times New Roman",serif'><o:p>&nbsp;</o:p></span></p>
  
  <b><span style='font-size:11.0pt;line-height:105%;font-family:"Times New Roman",serif;
  mso-fareast-font-family:"Times New Roman";mso-fareast-theme-font:minor-fareast;
  mso-ansi-language:EN-US;mso-fareast-language:EN-US;mso-bidi-language:AR-SA'><br
  clear=all style='mso-special-character:line-break;page-break-before:always'>
  </span></b>
  
  <p class=MsoNormal><b><span style='font-family:"Times New Roman",serif'><o:p>&nbsp;</o:p></span></b></p>
  
  <p class=MsoNormal style='margin-bottom:0in;line-height:normal'><span
  style='font-size:12.0pt;font-family:"Times New Roman",serif'>$$LINKBUDGETS$$ <o:p></o:p></span></p>
  
  </div>
  
  </body>
  
  </html>
  
`}