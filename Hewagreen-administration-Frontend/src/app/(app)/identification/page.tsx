"use client";

import useAuth from "@/controller/hooks/useAuth";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  Col,
  Form,
  List,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  DatePicker,
} from "antd";
import { useQuery } from "react-query";
import { EditIcon, ListCollapse, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { frenchFormattedDate } from "@/lib/dates";
import { baseURL } from "@/controller/api/config/baseUrl";

// import { Input } from "@/components/ui/input";
import { Input } from "antd";

const { Option } = Select;
import {
  _addIdentification,
  _identification,
  _updateIdentification,
} from "@/controller/tanstack/identification/getIdentification.service";
import { useEffect, useState } from "react";
import { IdentificationCredentials } from "@/types";

import { _province } from "@/controller/tanstack/province/getProvince.service";
import { _territoire } from "@/controller/tanstack/territoire/getTerritoire.service";
import { _village } from "@/controller/tanstack/village/getVillage.service";

import { _roles } from "@/controller/tanstack/role/getRole.service";
import useIdentification from "@/controller/tanstack/identification/useIdentification";
import { Select } from "antd";
import useDeleteIdentification from "@/controller/tanstack/identification/useDeleteIdenty";
import "react-phone-input-2/lib/style.css";
import { Moment } from "moment";
import Loader from "@/components/global/loader/Loader";
import { generateIdentificationPdf } from "@/components/docs/identificationpdf";
import { FiPrinter } from "react-icons/fi";
import { useForm } from "antd/es/form/Form";
import LayoutComponentDrawer from "@/view/model/LayoutComponentDrawer";
import useUpdateIdentifer from "@/controller/tanstack/identification/useUpdateIdentiter";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import 'dayjs/locale/fr';
import moment from "moment";
import { Collapse } from "antd";
import useAddRoleTouser from "@/controller/tanstack/identification/useAddRoleTouser";
import useDeleteRoleToUser from "@/controller/tanstack/identification/useDeleteRoleToUser";
const { Panel } = Collapse;

type DateValueType = string | null;
const Home = () => {
  const { token } = useAuth();
  const [idProvince, _setIdProvince] = useState("");
  const [idTerritoire, _setIdTerritoire] = useState("");

  const { data: dataIdentification, isLoading: dataIdentificationLoad } =
    useQuery("data-identification", () => _identification(token!));

  const { data: dataRole } = useQuery(
    "data-role",
    () => _roles(token!)
  );
  const { data: dataProvince } = useQuery(
    "data-province",
    () => _province(token!)
  );
  const { data: dataTerritoire } = useQuery(
    "auth-territoire",
    () => _territoire(token!, idProvince)
  );
  const { data: dataVillage } = useQuery(
    "auth-village",
    () => _village(token!, idTerritoire)
  );

  const [credentials, setCredentials] = useState<IdentificationCredentials>({
    nom: "",
    postnom: "",
    phone: "",
    idroles: [],
    genre: "",
    password: "",
    date_naiss: "",
    email: "",
    idprovince: 0,
    idterritoire: 0,
    idvillage: 0,
    adresse: "",
  });

  const initialFormValues: IdentificationCredentials = {
    nom: "",
    postnom: "",
    phone: "",
    idroles: [],
    genre: "",
    password: "",
    date_naiss: "",
    email: "",
    idprovince: 0,
    idterritoire: 0,
    idvillage: 0,
    adresse: "",
  };


  const [form] = Form.useForm<IdentificationCredentials>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const {
    mutateAsync: _addIdentification,
    isLoading: loadAddIdentification,
  } = useIdentification();
  const {
    mutateAsync: _updateIdentification,
    isLoading: loadUpdate,
  } = useUpdateIdentifer();

  const {
    mutateAsync: _addRoleToUser,
    isLoading: loadroleuser,
  } = useAddRoleTouser();

  const {
    mutateAsync: _deleteRoleToUser,
    isLoading: loaddeleteroleuser,
  } = useDeleteRoleToUser();

  const {
    mutateAsync: _deleteIdentification,
  } = useDeleteIdentification();

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    roleId: number
  ) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedRoles([...selectedRoles, roleId]);
    } else {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    }
  };

  const [phone, setPhone] = useState<string>("");


  const handleSubmit = async () => {
    await _addIdentification({
      credentials: {
        nom: credentials?.nom,
        postnom: credentials?.postnom,
        phone: credentials.phone,
        idroles: selectedRoles,
        genre: credentials?.genre,
        password: credentials?.password,
        date_naiss: credentials?.date_naiss,
        email: credentials?.email,
        idprovince: credentials?.idprovince,
        idterritoire: credentials?.idterritoire,
        idvillage: credentials?.idvillage,
        adresse: credentials?.adresse,
      },
      token: token!,
    });
  };


  const handleSubmitAddRole = async (idUser: number) => {
    await _addRoleToUser({
      credentials: {
        id_user: idUser,
        id_roles: selectedRoles
      },
      token: token!,
    });
  };

  const handleSubmitDeleteRole = async (idUser: number) => {
    await _deleteRoleToUser({
      credentials: {
        id_user: idUser,
        id_roles: selectedRoles
      },
      token: token!,
    });
  };

  const handleDelete = async (userId: number) => {
    await _deleteIdentification({
      useid: userId,
      token: token!,
    });
  };

  const handleGenreChange = (value: string) => {
    setGenreident(value)
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      genre: value,
    }));
  };

  const handleDateChange = (
    date: Moment | null,
    dateString: string | string[]
  ) => {
    if (date && dateString) {
      const formattedDate = Array.isArray(dateString)
        ? dateString[0]
        : dateString;
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        date_naiss: formattedDate,
      }));
    }
  };
  const [formattedDate, setFormattedDate] = useState<string>(moment().format("DD/MM/YYYY"));
  const formatReceivedDate = (dateString: string) => {
    return moment(dateString, ["DD/MM/YYYY", moment.ISO_8601]).format("DD/MM/YYYY");
  };

  const handleDateChange1 = (date: Moment | null, dateString: string) => {
    const formattedDateString = formatReceivedDate(dateString);
    // Mettre à jour la date formatée
    setFormattedDate(formattedDateString);
  };
  //add drawer
  useEffect(() => {
    form.setFieldsValue(credentials);
  }, [credentials]);

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const showDrawer = () => {
    setOpen(true);
    form.setFieldsValue(initialFormValues);
  };

  const onClose = () => {
    setOpen(false);
    setOpenUpdate(false)
    form.setFieldsValue(initialFormValues);
  };

  const [selectedProvinceId, setSelectedProvinceId] = useState<
    number | undefined
  >();

  const handleProvinceChange = (value: number) => {
    setSelectedProvinceId(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idprovince: value,
    }));
  };
  const [selectedTerritoirId, setSelectedTerritoirId] = useState<
    number | undefined
  >();

  const handleTerritoirChange = (value: number) => {
    setSelectedTerritoirId(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idterritoire: value,
    }));
  };

  const [selectedVillageId, setSelectedVillageId] = useState<
    number | undefined
  >();

  const handleVillage = (value: number) => {
    setSelectedVillageId(value)
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      idvillage: value,
    }));
  };

  const genreOptions = [
    { label: "Genre", value: "" },
    { label: "Masculin", value: "M" },
    { label: "Féminin", value: "F" },
  ];
  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataIdentification?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const [formIdentificationUpdate] = useForm<IdentificationCredentials>()
  const [name, setName] = useState("")
  const [postnom, setPostNom] = useState("")
  const [genreident, setGenreident] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [_adresse, setAdresse] = useState("")
  const [id, setId] = useState(Number)

  const showDrawerUpdate = (element: any) => {
    setOpenUpdate(true);

    // Define values directly from the element object
    const formattedDate = element?.date_naiss;
    const rolesFromResponse = element?.__tbl_ecom_roles?.map((role: any) => role.id);

    setName(element?.nom);
    setPostNom(element?.postnom);
    setPhone(element?.phone);
    handleGenreChange(element?.sexe);
    setPassword(element?.password);
    setFormattedDate(formattedDate);
    setEmail(element?.email);
    handleProvinceChange(element?.__tbl_ecom_province?.id);
    handleTerritoirChange(element?.__tbl_ecom_territoire?.id);
    handleVillage(element?.__tbl_ecom_village?.id);
    setAdresse(element?.addresse);
    setId(element?.id);
    setSelectedRoles(rolesFromResponse);

    formIdentificationUpdate.setFieldsValue({
      nom: element?.nom,
      postnom: element?.postnom,
      phone: element?.phone,
      idroles: rolesFromResponse,
      email: element?.email,
      genre: element?.sexe,
      password: element?.password,
      date_naiss: formattedDate,
      idprovince: element?.__tbl_ecom_province?.id,
      idterritoire: element?.__tbl_ecom_territoire?.id,
      idvillage: element?.__tbl_ecom_village?.id,
      adresse: element?.addresse
    });
  };

  // const handleUpdateId = async (userId: number) => {
  //   const values: IdentificationCredentials = await formIdentificationUpdate.validateFields()
  //   await _updateIdentification({
  //     credentials: values, 
  //     useid: userId,

  //     token: token!
  //   })

  // }

  const handleUpdateId = async (userId: number) => {
    // Valide les champs et obtient les valeurs du formulaire
    const values: IdentificationCredentials = await formIdentificationUpdate.validateFields();

    // Ajoute selectedRoles à values pour le champ idroles
    const updatedValues = {
      ...values,
      idroles: selectedRoles, // Associe idroles à selectedRoles
    };

    // Appelle la fonction _updateIdentification avec les valeurs mises à jour
    await _updateIdentification({
      credentials: updatedValues,
      useid: userId,
      token: token!,
    });
  };


  return (
    <div>
      <LayoutCompWithTable
        title="Listes des utilisateurs"
        btn={
          <>
            <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
              <Input.Search
                placeholder="Rechercher un utilisateur"
                className="placeholder:!text-xs"
                onSearch={(v) => setSearchedText(v)}
                onChange={(e) => setSearchedText(e.target.value)}
              />
              <Button onClick={showDrawer}>Ajouter L&apos; Utilisateur</Button>
              <Button onClick={() => generateIdentificationPdf('Liste des Utilisateur', filteredData)}><FiPrinter />Imprimer</Button>
            </div>


            <LayoutComponentDrawer
              onClose={onClose} open={open}
              btn=
              {<>
                <Space>
                  {/* <Button onClick={onClose}>Cancel</Button> */}
                  <Button onClick={handleSubmit}>
                    {loadAddIdentification ? <Loader /> : "Enregistrer"}
                  </Button>
                </Space>
              </>} title="Nouvelle Identificatition"
              form={
                <Form layout="vertical" hideRequiredMark>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="nom"
                        label="Nom"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le nom",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Entrez le nom"
                          name="nom"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="postnom"
                        label="Postnom"
                        rules={[{ required: true, message: "Entrez le postnom" }]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          name="postnom"
                          onChange={handleChange}
                          placeholder="Entrez le postnom"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Numéro de téléphone"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le numéro de téléphone",
                          },
                        ]}
                      >

                        <Input
                          style={{ width: "100%" }}
                          placeholder="Numéro de téléphone"
                          name="phone"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Adresse Email"
                        rules={[{ required: true, message: "Entrez l'adresse email" }]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez l'adresse email"
                          name="email"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        // onFinish={() => onFinish}

                        name="date_naiss"
                        label="Date de naissance"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la date de naissance",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          getPopupContainer={(trigger) => trigger.parentElement!}
                          format="DD/MM/YYYY"
                          onChange={handleDateChange}
                        />

                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="genre"
                        label="Genre"
                        rules={[{ required: true, message: "Entrez le genre" }]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          onChange={handleGenreChange}
                        >
                          {genreOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        // onFinish={() => onFinish}

                        name="idroles"
                        label="Roles"
                        rules={[
                          {
                            required: true,
                            message: "Entez le role",
                          },
                        ]}
                      >
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {dataRole?.data?.rows.map((option) => (
                              <div key={option.id} className="mb-2 mr-2">
                                <label className="flex items-center">
                                  <input
                                    name="idroles"
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-blue-500"
                                    checked={selectedRoles.includes(option.id)}
                                    onChange={(event) => handleCheckboxChange(event, option.id)}
                                  />
                                  <span className="ml-2">{option.role}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </dd>



                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="idprovince"
                        label="Province"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le province ",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder="Entrez le province"
                          onChange={handleProvinceChange}
                          filterOption={(input: string, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {dataProvince?.data?.rows?.map((item, i) => (
                            <Option
                              key={i}
                              value={item.id}
                            >{`${item.province}`}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="idterritoire"
                        label="Territoire"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le territoire ",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Entrez le territoire"
                          onChange={handleTerritoirChange}
                          showSearch
                          filterOption={(input: string, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {selectedProvinceId &&
                            dataTerritoire?.data?.rows
                              .filter(
                                (item) => item.idprovince === selectedProvinceId
                              )
                              .map((item, index) => (
                                <Option key={index} value={item.id}>
                                  {item.territoire}
                                </Option>
                              ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="idvillage"
                        label="Village"

                      >
                        <Select
                          placeholder="Entrez le village"
                          onChange={handleVillage}
                          showSearch
                          filterOption={(input: string, option: any) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {selectedTerritoirId &&
                            dataVillage?.data?.rows
                              .filter(
                                (item) =>
                                  item.idterritoire === selectedTerritoirId
                              )
                              .map((item, index) => (
                                <Option key={index} value={item.id}>
                                  {item.village}
                                </Option>
                              ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="password"
                        label="Mot de passe par defaut"
                        rules={[
                          {
                            required: true,
                            message: "Entrez le genre",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Mot de passe par defaut"
                          name="password"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="adresse"
                        label="Adresse"
                        rules={[
                          {
                            required: true,
                            message: "Entrez l'adresse",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Entrez l'adresse"
                          name="adresse"
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>

              }
            />

            <LayoutComponentDrawer
              onClose={onClose} open={openUpdate}
              btn=
              {<>
                <Space>
                  <Button onClick={() => handleUpdateId(id)}>
                    {loadUpdate ? <Loader /> : "Modifier"}
                  </Button>
                </Space>
              </>} title="Modifier L'identificatition"
              form={
                <>
                  <Form layout="vertical" form={formIdentificationUpdate}

                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="nom"
                          label="Nom"
                          rules={[
                            {
                              required: true,
                              message: "Entrez le nom",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Entrez le nom"
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="postnom"
                          label="Postnom"
                          rules={[{ required: true, message: "Entrez le postnom" }]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            name="postnom"
                            onChange={handleChange}
                            placeholder="Entrez le postnom"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="phone"
                          label="Numéro de téléphone"
                          rules={[
                            {
                              required: true,
                              message: "Numéro de téléphone",
                            },
                          ]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            placeholder="Numéro de téléphone"
                            name="phone"
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="email"
                          label="Adresse email"
                          rules={[{ required: false, message: "Entrez l'adresse email" }]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            placeholder="Entrez l'adresse email"
                            name="email"
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          // onFinish={() => onFinish}
                          name="date_naiss"
                          label="Date de naissance"
                          rules={[
                            {
                              required: false,
                              message: "Entez la date de naissance",
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            value={formattedDate ? moment(formattedDate, "DD/MM/YYYY") : null}
                            format="DD/MM/YYYY"
                            onChange={(date, dateString) => handleDateChange1(date, dateString as string)}
                          /><span className="text-white">;</span>

                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="genre"
                          label="Genre"
                          rules={[{ required: false, message: "Entrez le genre" }]}
                        >
                          <Select
                            style={{ width: "100%" }}
                            onChange={handleGenreChange}
                          >
                            {genreOptions.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>



                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name="idprovince"
                          label="Province"
                          rules={[
                            {
                              required: false,
                              message: "Entrez le province ",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            placeholder="Entrez le province"
                            onChange={handleProvinceChange}
                            filterOption={(input: string, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {dataProvince?.data?.rows?.map((item, i) => (
                              <Option
                                key={i}
                                value={item.id}
                              >{`${item.province}`}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          name="idterritoire"
                          label="Territoire"
                          rules={[
                            {
                              required: false,
                              message: "Entrez le territoire ",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Entrez le territoire"
                            onChange={handleTerritoirChange}
                            showSearch
                            filterOption={(input: string, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {selectedProvinceId &&
                              dataTerritoire?.data?.rows
                                .filter(
                                  (item) => item.idprovince === selectedProvinceId
                                )
                                .map((item, index) => (
                                  <Option key={index} value={item.id}>
                                    {item.territoire}
                                  </Option>
                                ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          name="idvillage"
                          label="Village"

                        >
                          <Select
                            placeholder="Entrez le village"
                            showSearch
                            filterOption={(input: string, option: any) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={handleVillage}
                          >
                            {selectedTerritoirId &&
                              dataVillage?.data?.rows
                                .filter(
                                  (item) =>
                                    item.idterritoire === selectedTerritoirId
                                )
                                .map((item, index) => (
                                  <Option key={index} value={item.id}>
                                    {item.village}
                                  </Option>
                                ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>


                      {/* <Col span={12}>
                        <Form.Item
                          name="password"
                          label="Mot de passe par defaut"
                          rules={[
                            {
                              required: true,
                              message: "Entrez le mot de passe par defaut",
                            },
                          ]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            placeholder="Mot de passe par defaut"
                            name="password"
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </Col> */}
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="adresse"
                          label="Adresse"
                          rules={[
                            {
                              required: false,
                              message: "Entrez l'adresse",
                            },
                          ]}
                        >
                          <Input
                            style={{ width: "100%" }}
                            placeholder="Entrez l'adresse"
                            name="adresse"
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </Col>

                      {/* <Col span={24}>
                        <Collapse defaultActiveKey={["1"]} accordion>
                          <Panel header="Modifier ou supprimer le role a l'utilisateur" key="1">
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  name="idroles"
                                  label="Roles"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Entez le role",
                                    },
                                  ]}
                                >

                                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                      {dataRole?.data?.rows.map((option) => (
                                        <div key={option.id} className="mb-2 mr-2">
                                          <label className="flex items-center">
                                            <input
                                              name="idroles"
                                              type="checkbox"
                                              className="form-checkbox h-5 w-5 text-blue-500"
                                              checked={selectedRoles.includes(option.id)}
                                              onChange={(event) => handleCheckboxChange(event, option.id)}
                                            />
                                            <span className="ml-2">{option.role}</span>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </dd>
                                </Form.Item>
                              </Col>
                            </Row>
                            <p className="flex">
                                <div className="mr-5"><Button onClick={() => handleSubmitAddRole(id)}>Attibuer Role</Button></div>
                                <div><Button  onClick={() => handleSubmitDeleteRole(id)}>Supprimer Role</Button></div>
                            </p>
                          </Panel>
                          <Panel header="Titre de l'élément 2" key="2">
                            <p>Contenu de l'élément 2</p>
                          </Panel>
                          <Panel header="Titre de l'élément 3" key="3">
                            <p>Contenu de l'élément 3</p>
                          </Panel>
                        </Collapse>
                      </Col> */}

                      <Col span={24}>
                        <Collapse defaultActiveKey={["1"]} accordion>
                          <Panel header="Modifier ou supprimer le rôle de l'utilisateur" key="1">
                            <Row gutter={16}>
                              <Col span={24}>
                                <Form.Item
                                  name="idroles"
                                  label="Rôles"
                                  rules={[
                                    {
                                      required: false,
                                      message: "Veuillez sélectionner au moins un rôle.",
                                    },
                                  ]}
                                >
                                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                      {dataRole?.data?.rows.map((option) => (
                                        <div key={option.id} className="mb-2 mr-2">
                                          <label className="flex items-center">
                                            <input
                                              name="idroles"
                                              type="checkbox"
                                              className="form-checkbox h-5 w-5 text-blue-500"
                                              checked={selectedRoles.includes(option.id)}
                                              onChange={(event) =>
                                                handleCheckboxChange(event, option.id)
                                              }
                                            />
                                            <span className="ml-2">{option.role}</span>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </dd>
                                </Form.Item>
                              </Col>
                            </Row>

                            <Row gutter={16}>
                              <Col span={12}>
                                <Button
                                  variant={"default"}
                                  onClick={() => handleSubmitAddRole(id)}
                                  disabled={selectedRoles.length === 0}
                                >
                                  Update rôle
                                </Button>
                              </Col>
                              <Col span={12}>
                                <Button
                                  variant={"destructive"}
                                  onClick={() => handleSubmitDeleteRole(id)}
                                  disabled={selectedRoles.length === 0}
                                >
                                  Supprimer rôle
                                </Button>
                              </Col>
                            </Row>
                          </Panel>

                          {/* <Panel header="Titre de l'élément 2" key="2">
                            <p>Contenu de l'élément 2</p>
                          </Panel>
                          <Panel header="Titre de l'élément 3" key="3">
                            <p>Contenu de l'élément 3</p>
                          </Panel> */}
                        </Collapse>
                      </Col>
                    </Row>
                  </Form>
                </>
              }
            />
          </>
        }
        content={
          <div>
            {
              dataIdentificationLoad ? (
                <SpinLoader />
              ) : (
                <Table
                  dataSource={filteredData}
                  loading={dataIdentificationLoad}
                  className=" h-[70vh] overflow-auto"
                  columns={[
                    {
                      title: "N°",
                      dataIndex: "index",
                      key: "index",
                      render: (_, __, index) => index + 1,
                      width: "3rem",
                    },
                    {
                      title: "Nom complet",
                      dataIndex: "name",
                      key: "name",
                      render: (_, item, _index) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                            title={
                              <strong>
                                {`${item?.nom} ${item?.postnom} ${item?.prenom}`}
                              </strong>
                            }
                            description={item?.email}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Tel",
                      dataIndex: "tel",
                      key: "tel",
                      render: (_, item, _index) => <a>{item?.phone}</a>,
                    },
                    {
                      title: "Date de création",
                      dataIndex: "date",
                      key: "date",

                      render: (_, item, _index) => (
                        <a>{frenchFormattedDate(item?.createdAt)}</a>
                      ),
                    },
                    {
                      title: "Modifier",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item, _index) => (
                        <>
                          <Tag onClick={() => showDrawerUpdate(item)} color="green" className="cursor-pointer p-2">
                            <EditIcon size={16} />
                          </Tag>
                        </>
                      ),
                    },
                    {
                      title: "Supprimer",
                      key: "delete",
                      align: "center",
                      render: (_, item, _index) => (
                        <>
                          <Popconfirm
                            placement="bottom"
                            title="Suppression utilisateur"
                            description="Voulez-vous vraiment supprimer cet utilisateur"
                            okText="Supprimer"
                            cancelText="NON"
                            onConfirm={() => handleDelete(item?.id)}
                          >
                            <Tag color="volcano" className=" p-2">
                              <Trash2 size={16} />
                            </Tag>
                          </Popconfirm>
                        </>
                      ),
                    },
                    {
                      title: "Détail",
                      key: "datail",
                      align: "center",
                      render: (_, item, _index) => (
                        <>
                          <Sheet>
                            <SheetTrigger>
                              <Tag color="green" className=" p-2">
                                <ListCollapse size={16} />
                              </Tag>
                            </SheetTrigger>
                            <SheetContent className="w-[900px] md:w-full md:max-w-2xl lg:max-w-3xl">
                              <SheetHeader className=" w-full">
                                <SheetTitle>Détail utilisateur</SheetTitle>
                                <SheetDescription>
                                  <div className=" w-full py-6 px-2 flex flex-col gap-8">
                                    <div className=" w-full flex justify-center">
                                      <Avatar
                                        src={`${baseURL}/${item?.avatar}`}
                                        className=" w-20 h-20"
                                      />
                                    </div>
                                    <div>
                                      <div className="h-[60vh] overflow-auto">
                                        <div className="border-t border-gray-200  py-5 sm:p-0">
                                          <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Nom
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.nom} ${item?.postnom} ${item?.prenom}`}
                                                </strong>
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Email
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.email}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Tel
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.phone}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Date de Naissance
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {frenchFormattedDate(
                                                  item?.date_naiss
                                                )}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Genre
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.sexe}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Province
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_province?.province}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Territoire
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {
                                                  item?.__tbl_ecom_territoire
                                                    ?.territoire
                                                }
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Village
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_village?.Village}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Roles
                                              </dt>

                                              <dd className="mt-1 text-sm text-red-400 sm:mt-0 sm:col-span-2">
                                                <div className=" flex gap-2  ">
                                                  {item?.__tbl_ecom_roles?.map(
                                                    (role: any, i: number) => (
                                                      <>
                                                        <h5 key={i}>{role.role}</h5>
                                                      </>
                                                    )
                                                  )}
                                                </div>
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Date Enregistrement
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {frenchFormattedDate(item?.createdAt)}
                                              </dd>
                                            </div>
                                          </dl>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </SheetDescription>
                              </SheetHeader>
                            </SheetContent>
                          </Sheet>
                        </>
                      ),
                    },
                  ]}
                />
              )
            }
          </div>

        }
      />
    </div>
  );
};

export default Home;
