export default style = {
  heading: {
    fontStyle: "italic",
    fontSize: "30px",
    textAlign: "center",
    color: "#fff",
    marginBottom: "40px"
  },
  subHeading: {
    fontSize: "14px",
    fontWeight: "normal",
    textAlign: "center",
    color: "#fff",
    padding: "0 20%",
    marginBottom: "10px"
  },
  install: {
    textAlign: "center",
    marginBottom: "20px",
    color: "white",
    repo: {
      fontVariant: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      color: "white"
    },
    bash: {
      backgroundColor: "#58A6DB",
      display: "inline",
      padding: "8px 15px",
      borderRadius: "5px",
      fontFamily: "monospace",
      border: "solid 1px #2096CD",
      whiteSpace: "nowrap",
      lineHeight: "45px"
    }
  },
  content: {
    background: "#fff",
    padding: "35px 20px 25px 20px",
    heading: {
      color: "#565656",
      margin: "0 0 1rem 0"
    },
    intro: {
      marginBottom: "1rem",
      color: "#747474",
      lineHeight: "1.2rem",
      textAlign: "justify"
    }
  },
  method: {
    thermometer: {
      padding: "20px 0 20px 50px",
      float: "left"
    },
    label: {
      textAlign: "center",
      paddingTop: "35%",
      fontSize: "50px",
      fontWeight: "bold",
      color: "lightgrey"
    },
    subLabel: {
      textAlign: "center",
      paddingTop: "1rem",
      fontSize: "25px",
      fontWeight: "bold",
      color: "lightgrey"
    }
  },
  collection: {
    olList: {
      paddingLeft: "40px",
      maxHeight: "380px",
      overflow: "scroll"
    }
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    border: "solid 1px #CCC",
    outline: "none",
    marginBottom: "1rem"
  },
  button: {
    padding: "10px 20px",
    background: "#2096cd",
    color: "#FFF",
    border: "none",
    outline: "none",
    cursor: "pointer",
    marginRight: "20px",
    marginBottom: "1rem",
    last: function() {
      let last = Object.assign({}, this);
      last.marginRight = "none";
      return last;
    }
  },
  todo: {
    listStyleType: "decimal",
    marginBottom: "1rem",
    title: {
      fontWeight: "bold",
      borderBottom: "lightgray 1px solid",
      marginBottom: "3px"
    },
    text: {
      fontSize: "11px"
    }
  }
};
