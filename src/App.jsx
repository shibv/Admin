import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Button, Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import {
  LinearProgress,
  TableContainer,
  TableHead,
  Table,
  TextField,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const label = { inputProps: { "aria-label": "controlled" } };

const useStyles = makeStyles(() => ({
  row: {
    backgroundColor: "white",
    color: "black",
    cursor: "pointer",
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "black",
    },
  },
}));

function App(props) {
  // hooks
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState(false);
  //Hooks to edit the row data
  const [editId, setEdit] = useState(0);
  const [editedname, setEditedName] = useState("");
  const [editedemail, setEditedEmail] = useState("");
  const [editedrole, setEditedRole] = useState("");
  // delete checked data
  const [checkedelements, setCheckedElements] = useState([]);

  const handleToggleChange = (id) => {
    setCheckedElements(checkedelements.filter((it) => it.id !== id));
  };

  const handle_checked_elements = () => {
    console.log(checkedelements);
    setContent(checkedelements);
  };

  const edit = (id, name, email, role) => {
    setEdit(id);
    setEditedName(name);
    setEditedEmail(email);
    setEditedRole(role);
  };

  const handleSave = (id) => {
    content.map((it) => {
      if (it.id === id) {
        it.name = editedname;
        it.email = editedemail;
        it.role = editedrole;
      }
    });

    setEdit(0);
  };

  const removeItem = (id) => {
    setContent(content.filter((it) => it.id !== id));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      //console.log(data);
      setContent(data);
      setCheckedElements(data);
      setLoading(false);
    } catch (error) {
      console.error("Axios Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const handleSearch = () => {
    return content.filter((cont) => cont.name.toLowerCase().includes(search));
  };

  const classes = useStyles(props);
  return (
    
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Admin Panel
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <TextField
            label="serach admin name"
            variant="outlined"
            style={{ marginBottom: 20, width: "100%", color: "white" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          ></TextField>
          <IconButton aria-label="delete" size="large" backgroundColor="red">
            
            <Button variant="contained" style={{height:"60px", marginBottom:"17px"}}> <DeleteIcon fontSize="inherit" onClick={handle_checked_elements} /></Button>
          </IconButton>
        </Stack>

        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "aqua" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "aqua" }}>
                <TableRow>
                  {["", "Name", "Email", "Role", "Action"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return editId === row.id ? (
                      <TableRow className={classes.row} key={row.name}>
                        <TableCell>
                          <Checkbox
                            key={row.id}
                            {...label}
                            checked={checked}
                            onChange={() => handleChange(row.id)}
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            type="text"
                            label="Enter Name"
                            variant="outlined"
                            value={editedname}
                            onChange={(e) => {
                              setEditedName(e.target.value);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            label="Enter Email"
                            variant="outlined"
                            value={editedemail}
                            onChange={(e) => {
                              setEditedEmail(e.target.value);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            label="Enter Role"
                            variant="outlined"
                            value={editedrole}
                            onChange={(e) => {
                              setEditedRole(e.target.value);
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleSave(row.id)}
                          >
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow className={classes.row} key={row.name}>
                        <TableCell>
                          <Checkbox
                            key={row.id}
                            {...label}
                            onChange={() => {
                              handleToggleChange(row.id);
                            }}
                          />
                        </TableCell>

                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.role}</TableCell>

                        <TableCell>
                          <DeleteIcon
                            onClick={() => {
                              removeItem(row.id);
                            }}
                          />
                          <EditIcon
                            onClick={() => {
                              edit(row.id, row.name, row.email, row.role);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "black",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        ></Pagination>
      </Container>

  );
}

export default App;
