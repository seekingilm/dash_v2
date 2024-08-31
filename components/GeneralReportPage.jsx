import React, { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import Modal from '@mui/material/Modal';
import * as XLSX from "xlsx";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { FormControl, Button, Input, Typography, Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SideBar from "./Sidebar";
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';

import pie from '../public/pdf_images/pie.png';
import bar from '../public/pdf_images/bar.png';
import radial from '../public/pdf_images/radial.png';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    padding: 10,
    color: '#FFFFFF',
  },
  logoSection: {
    width: '50%',
    padding: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  reportSection: {
    width: '50%',
    textAlign: 'right',
    padding: 10,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportSubtitle: {
    fontSize: 12,
    marginTop: 5,
  },
  reportDate: {
    fontSize: 12,
    marginTop: 10,
  },
  summaryHeader: {
    backgroundColor: '#4A4A8A',
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    color: '#000000',
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
  },
  bodyText: {
    fontSize: 12,
    display: 'block',
    marginBottom: 5,
  },
  footer: {
    marginTop: 'auto',
    padding: 10,
    textAlign: 'center',
    fontSize: 10,
    color: '#555555',
  },
  image: {
    width: '80%',
    height: 'auto',
    marginBottom: 10,
    alignSelf: 'center',
  },
  imageSubheading: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  images: {
    height: '250px',
  },
});

function Sheet(props) {
  const [excelFile, setExcelFile] = useState(null);
  const [dataJSON, setDataJSON] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '1rem',
    boxShadow: 24,
    p: 4,
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setDataJSON(data);
      props.onSubmit(data);
      setExcelData(data.slice(0, 10));
    }
  };

  return (
    <Box ml={2} mt={2}>
      <Button onClick={handleOpen} variant="contained">Upload</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleFileSubmit}>
            <FormControl>
              <Input type="file" required onChange={handleFile} />
              <Button variant="contained" type="submit" sx={{ mt: 2 }}>Upload</Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

function GeneralReportPage() {
  const [returnData, setReturnData] = useState(null);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/table', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(returnData)
      }).then(res => res.json()).
        then(res => {
          if (res.constructor === Array) {
              setAllData(res)
          }
        })
  }, [returnData]);

  function highestReportCountry(arr) {
    if (!Array.isArray(arr)) {
      return [];
    }

    const result = {};

    arr.forEach(obj => {
      const { country, abuse, totalReports, ipAddress, usageType } = obj;

      if (!result[country]) {
        result[country] = { totalAbuse: 0, totalReports: 0, ipAddress, usageType, count: 0 };
      }

      // Aggregate abuse and other details
      result[country].totalAbuse += abuse;
      result[country].totalReports += totalReports;
      result[country].ipAddress = ipAddress; // Assuming last IP address to be kept
      result[country].usageType = usageType; // Assuming last usage type to be kept
      result[country].count += 1;
    });

    // Calculate average abuse per country and prepare the result array
    const sortedCountries = Object.keys(result)
      .map(country => ({
        country,
        abuse: Math.round(result[country].totalAbuse / result[country].count), // Calculate average abuse
        reports: result[country].totalReports,
        ip: result[country].ipAddress,
        type: result[country].usageType
      }))
      .sort((a, b) => b.abuse - a.abuse); // Sort by average abuse

    return sortedCountries.slice(0, 5); // Return top 5 countries
  }

  function extractBigThree(arr) {
    if (!Array.isArray(arr)) {
      return [];
    }
  
    let returnArray = [];

    arr.forEach(obj => {
      const { country, abuse, totalReports, ip, category } = obj;

      returnArray.push({
        'country': country,
        'abuse': abuse,
        'total': totalReports,
        'ip': ip,
        'usageType': category
      })  

      console.log(returnArray)
    });

    returnArray.sort((a, b) => {
      if(a['abuse'] > b['abuse']){
        return -1;
      }else {
        return 1;
      }
    });

    return returnArray.slice(0, 5)
  }

  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#f3f3f3",
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const getData = (data) => {
    console.log("setting returnData to " + JSON.stringify(data));
    setReturnData(data);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const ReportSummary = () => {
    if(allData.length > 0) {
      return (
        <Text style={styles.bodyText}>
          <b>IP Address:</b>  IP Address: {extractBigThree(allData)[0]['ip']}{"\n"}
          <b>Location:</b> Location: {extractBigThree(allData)[0]['country']}{"\n"}
          <b>Type of Abuse:</b> Type of Abuse: {extractBigThree(allData)[0]['category'] ? extractBigThree(allData)[0]['usageType'] : "Not Found"}
          {"\n"}
          <b>Total Reports:</b> Total Reports: {extractBigThree(allData)[0]['total']}

          {"\n\n"}
          <b>IP Address:</b>  IP Address: {extractBigThree(allData)[1]['ip']}{"\n"}
          <b>Location:</b> Location: {extractBigThree(allData)[1]['country']}{"\n"}
          <b>Type of Abuse:</b> Type of Abuse: {extractBigThree(allData)[1]['category'] ? extractBigThree(allData)[1]['usageType'] : "Not Found"}{"\n"}
          <b>Total Reports:</b> Total Reports: {extractBigThree(allData)[1]['total']}

          {"\n\n"}
          <b>IP Address:</b>  IP Address: {extractBigThree(allData)[2]['ip']}{"\n"}
          <b>Location:</b> Location: {extractBigThree(allData)[2]['country']}{"\n"}
          <b>Type of Abuse:</b> Type of Abuse: {extractBigThree(allData)[2]['category']? extractBigThree(allData)[2]['usageType'] : "Not Found"}
          {"\n"}
          <b>Total Reports:</b> Total Reports: {extractBigThree(allData)[2]['total']}

          {"\n\n"}
          <b>IP Address:</b>  IP Address: {extractBigThree(allData)[3]['ip']}{"\n"}
          <b>Location:</b> Location: {extractBigThree(allData)[3]['country']}{"\n"}
          <b>Type of Abuse:</b> Type of Abuse: {extractBigThree(allData)[3]['usageType'] ? extractBigThree(allData)[3]['usageType'] : "Not Found"}
          {"\n"}
          <b>Total Reports:</b> Total Reports: {extractBigThree(allData)[3]['total']}

          {"\n\n"}

          <b>IP Address:</b>  IP Address: {extractBigThree(allData)[4]['ip']}{"\n"}
          <b>Location:</b> Location: {extractBigThree(allData)[4]['country']}{"\n"}
          <b>Type of Abuse:</b> Type of Abuse: {extractBigThree(allData)[4]['usageType'] ? extractBigThree(allData)[4]['usageType'] : "Not Found"}
          {"\n"}
          <b>Total Reports:</b> Total Reports: {extractBigThree(allData)[4]['total']}

          {"\n\n"}


          <Text style={styles.imageSubheading}>Summary Breakdown </Text>
          {"\n\n"}
          <Text style={styles.reportSubtitle}>
            The data indicates that the majority of the reported IP addresses have low abuse confidence scores and were flagged by a single user, suggesting a low likelihood of confirmed malicious activity. This pattern may indicate the presence of false positives or isolated incidents rather than widespread threats. The reports primarily involve IPs associated with data centers, web hosting, and other infrastructure services, which are commonly used for both legitimate and malicious purposes. However, in this case, there is no strong evidence pointing to abuse, making it less urgent to take immediate action against these IPs.
          </Text>
        </Text>

      );
      }else{
      return (
        <Text>Upload Data</Text>
      )
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", width: "100vw" }}>
        <CssBaseline />
        <AppBar sx={{
          backgroundColor: "#0039a6",
        }} position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Intel Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <SideBar open={open} setOpen={setOpen} DrawerHeader={DrawerHeader} />
        <Box
          component="main"
          sx={{
            backgroundColor: theme.palette.background.default,
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: open
              ? `${drawerWidth}px`
              : `calc(${theme.spacing(7)} + 1px)`,
            width: open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${theme.spacing(7)} - 1px)`,
          }}
        >
          <DrawerHeader />
          <Container sx={{ mt: 4, mb: 4 }}>
            <Box
              sx={{
                textAlign: "center",
    padding: "20px",
    backgroundColor: "#ffffff", // White background
    color: "#000000", // Black text
    borderRadius: "8px",
    marginBottom: "20px",
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                INSIDE REPORT
              </Typography>
              <Typography variant="h5" sx={{ marginBottom: "8px" }}>
                AbuseIPDB Intelligence Report Executive Summary
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                Date: {new Date().toLocaleDateString('en-US')}              </Typography>
              <Typography variant="h6" sx={{ marginBottom: "20px" }}>
              The report generated in this code is a PDF report that is customized to present a detailed analysis of cybersecurity data, specifically focusing on suspicious IP addresses and their associated activities. Plug in your excel path of Ip address to get your report 
              </Typography>
              <Divider sx={{ borderColor: "#000000", borderWidth: "2px", marginBottom: "5px" }} />
            </Box>

            <Sheet onSubmit={getData} />

            <Grid container spacing={3} mt={2}>
              <Grid item xs={12}>
                <Card sx={{ p: 3, borderRadius: "1em", height: 800 }}>
                  <PDFViewer style={{ width: '100%', height: '100%' }}>
                    <Document>
                      <Page style={styles.page}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                          <View style={styles.logoSection}>
                            <Text style={styles.logoText}>IP Genenerated Report</Text>
                          </View>
                          <View style={styles.reportSection}>
                            <Text style={styles.reportTitle}>SECTOR TARGETING:</Text>
                            <Text style={styles.reportSubtitle}>
                              Analysis of Suspicious IP Activity and Potential Cybersecurity Threats
                            </Text>
                            <Text style={styles.reportDate}>Date of Report: Auguest 16, 2024</Text>
                          </View>
                        </View>

                        {/* Summary Header */}
                        <View style={styles.summaryHeader}>
                          <Text>EXECUTIVE SUMMARY</Text>
                        </View>

                        {/* IP Address Details at the Beginning */}
                        <View style={styles.section}>
                          <Text style={styles.subheading}>IP Address Analysis:</Text>
                          <Text style={styles.bodyText}>
                            One of the key IP addresses identified is <b>50.47.208.178</b>, which is associated with the ISP <b>Ziply Fiber</b> and the domain <b>ziplyfiber.com</b>. This IP address is linked to suspicious activity and has been reported <b>5,632</b> times by <b>373</b> distinct users. The high abuse confidence score of <b>100</b> indicates a strong likelihood of ongoing malicious activity. The associated hostname is <b>50-47-208-178.evrt.wa.ptr.ziplyfiber.com</b>, and it is categorized under Fixed Line ISP usage. Further investigation and monitoring are recommended to address the potential threats posed by this IP.
                          </Text>
                        </View>

                        {/* Additional Content Here */}
                        <View style={styles.section}>
                          <Text style={styles.bodyText}>
                            This report provides a comprehensive analysis of malicious IP addresses extracted from an Excel sheet, utilizing data from an open-source platform's API. The report focuses on identifying key trends, significant incidents, and actionable insights to enhance cybersecurity measures. Through this analysis, we have uncovered critical patterns and threats that require immediate attention and mitigation.
                          </Text>
                        </View>

                        {/* Key Highlights */}
                        <View style={styles.summaryHeader}>
                          <Text>KEY HIGHLIGHTS</Text>
                        </View>
                        <View style={styles.section}>
                          <Text style={styles.bodyText}>- Significant Security Events: Identified major incidents involving the top offending IP addresses, including DDoS attacks, phishing campaigns, and unauthorized access attempts.</Text>
                          <Text style={styles.bodyText}>- Progress on ongoing cybersecurity projects or mitigations.</Text>
                          <Text style={styles.bodyText}>- Overview of key metrics and trends observed in the report.</Text>
                        </View>

                        {/* Report Summary for IP Addresses */}
                        <View style={styles.summaryHeader}>
                          <Text>REPORT SUMMARY FOR IP ADDRESSES</Text>
                        </View>
                        <View style={styles.section}>
                          <Text style={styles.subheading}>Total Number of IPs Analyzed: </Text>
                          <Text style={styles.bodyText}>Count: {allData.length > 0 ? allData.length : "Upload Data"}</Text>

                          <Text style={styles.subheading}>Countries with the Most Offending IPs:</Text>
                          <Text style={styles.bodyText}>
                            • {allData.length > 1 ? highestReportCountry(allData)[0]['country'] : "Upload Data"  } 
                            • {allData.length > 1 ? highestReportCountry(allData)[1]['country'] : "Upload Data"  } 
                            • {allData.length > 1 ? highestReportCountry(allData)[2]['country'] : "Upload Data"  } 
                            • {allData.length > 1 ? highestReportCountry(allData)[3]['country'] : "Upload Data"  } 
                            • {allData.length > 1 ? highestReportCountry(allData)[4]['country'] : "Upload Data"  } 
                          </Text>

                          <Text style={styles.subheading}>Top Five Offending IPs:</Text>
                                                    {/* Additional IP details here */}
                          <ReportSummary/>
                        </View>

                        {/* Data Visualization Heading */}
                        <View style={styles.summaryHeader}>
                          <Text>DATA VISUALIZATION</Text>
                        </View>

                        <View style={styles.section}>
                          <Text style={styles.imageSubheading}>Bar Chart Visualization</Text>
                          <Image  src={bar} style={styles.images}/>
                          <Text style={styles.imageSubheading}>Pie Chart Visualization</Text>
                          <Image src={pie} />
                          <Text >Radial Chart Visualization</Text>
                          <Image  src={radial} />
                        </View>

                        {/* Conclusion */}
                        <View style={styles.summaryHeader}>
                          <Text>CONCLUSION</Text>
                        </View>
                        <View style={styles.section}>
                          <Text style={styles.bodyText}>
                            The integration of IP address analysis with open-source threat intelligence provides a powerful tool for identifying and mitigating cybersecurity risks. By visualizing the data effectively and focusing on key metrics, the organization can enhance its security posture and make informed decisions to protect against evolving threats.
                          </Text>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                          <Text>Page 1</Text>
                        </View>
                      </Page>
                    </Document>
                  </PDFViewer>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default GeneralReportPage;

