"use client";
import useAuth from '@/controller/hooks/useAuth';
import { _agriculteur, _agriculteurById } from '@/controller/tanstack/agriculteurs/getAgriculteur.service';
import { _cooperative } from '@/controller/tanstack/cooperative/getCooperative.service';
import LayoutCompWithTable from '@/view/model/LayoutCompWithTable'
import { Avatar, Col, Input, List, Row, Table, Tag, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query';
import QRCode from 'react-qr-code';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import { FaRegIdCard } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { _province } from '@/controller/tanstack/province/getProvince.service';
import { _territoire } from '@/controller/tanstack/territoire/getTerritoire.service';
import { _village } from '@/controller/tanstack/village/getVillage.service';
import { _categorieCooperative } from '@/controller/tanstack/categorieCooperative/getCategCooperative.service';
import { CiSaveDown2 } from "react-icons/ci";
import { useToast } from '@/components/ui/use-toast';
const { Option } = Select;

const Home = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [numerCarte, setNumerCarte] = useState('')
  const [numerCarteEncod, setNumerCarteEncod] = useState('')
  // const [loadBycoop, _setLoadBycoop] = useState('')
  const [nom, setNom] = useState('')
  const [postnom, setPostNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [idTerritoire, setIdTerritoire] = useState('')
  const [idProvince, setIdProvince] = useState('')
  // const [idvillage, setIdVillage] = useState('')
  const [cooperative, setCooperative] = useState('')
  const [categorie, setCategorie] = useState('')
  const [dateExpiration, setDateExpiration] = useState('')

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;


  const { data: dataProvince } = useQuery(
    "data-province",
    () => _province(token!)
  );
  const { data: dataTerritoire } = useQuery(
    "auth-territoire",
    () => _territoire(token!, '')
  );
  const { data: _dataVillage } = useQuery(
    "auth-village",
    () => _village(token!, '')
  );

  const { data: dataCategCooperative } = useQuery("auth-categ", () =>
    _categorieCooperative(token!)
  );



  const [activeCooperative1, setActiveCooperative1] = useState<string | null>(null);

const { data: dataCooperativeSelect, isLoading: isLoadingCooperative } = useQuery(
  "auth-coop1",
  () => _cooperative(token!),
  {
    enabled: !!token,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: (data) => {
      // Vérifiez si data et ses propriétés existent
      if (activeCooperative1 === null && data?.data?.rows?.length) {
        setActiveCooperative1(String(data.data.rows[0].id)); // Convertir l'id en chaîne
      }
    }
  }
);



  const { data: dataAgricultureById, isLoading: dataAgriculteurLoard, refetch: refetchAgri } = useQuery(
    "auth-categby",
    () => {
      if (activeCooperative1) {
        return _agriculteurById(token!, activeCooperative1);
      }
      return Promise.resolve(null); // Ou gérez-le comme bon vous semble
    },
    {
      enabled: !!activeCooperative1, // Ne pas exécuter la requête si activeCooperative1 est null
    }
  );
  //carte
  const ref = useRef<HTMLDivElement | null>(null);
  const [image, takeScreenshot] = useScreenshot();
  const [genereated, setGenerated] = useState(false);
  const [dateValidate, _setDateValidate] = useState('')

  const getImage = async () => {
    if (ref.current) {
      await takeScreenshot(ref.current);
      setGenerated(true);
    }
  };

  useEffect(() => {
    if (genereated) {
      toast({
        description: `Vous venez de générer la carte pour ce membre, veuillez cliquer sur télécharger !!`,
      });
    }
  }, [image, genereated, dateValidate, toast]);

  const download = (iImage: any, { name = 'img', extension = 'png' } = {}) => {
    const a = document.createElement('a');
    a.href = iImage;
    a.download = createFileName(extension, name);
    a.click();
  };

  const showElementToCarte = (element: any) => {
    setNumerCarte(element?.carte)
    setNom(element.__tbl_ecom_user?.nom)
    setPostNom(element.__tbl_ecom_user?.postnom)
    setPrenom(element.__tbl_ecom_user?.prenom)
    const provinceTrouvee = dataProvince?.data?.rows?.find((territoire) => territoire.id === element.__tbl_ecom_cooperative.id_province)?.province;
    setIdProvince(provinceTrouvee as string);
    const provinceTerritoir = dataTerritoire?.data.rows?.find((territoire) => territoire.id === element.__tbl_ecom_cooperative.id_territoire)?.territoire;
    setIdTerritoire(provinceTerritoir as string);
    const seachCategCoop = dataCategCooperative?.data?.rows?.find((categ) => categ.id === element.__tbl_ecom_cooperative.id_category)?.category;
    setCategorie(seachCategCoop as string);
    setCooperative(element.__tbl_ecom_cooperative.cooperative)
    setDateExpiration(element.date_expiration)

    setNumerCarteEncod(element?.id.toString())
  };

  const telecharger = async () => {
    download(image, { name: 'image', extension: 'png' })
  }

  const [searchedText, setSearchedText] = useState<string>("");

  const filteredData = dataAgricultureById?.data?.rows?.filter(
    (item: any): boolean => {
      return item?.__tbl_ecom_user && Object.keys(item?.__tbl_ecom_user).some((key: string) =>
        item?.__tbl_ecom_user[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  useEffect(() => {
    if (activeCooperative1) {
      refetchAgri()
    }

  }, [activeCooperative1, refetchAgri]);

  const handleCoopChange = (value: string) => {
    setActiveCooperative1(value)
  };

  return (
    <div>
      <h1 className="font-semibold text-xl">Gestion carte d&apos; agriculteurs</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <>
            <main>
              {activeCooperative1 && (
                <div className="mb-1">
                  <LayoutCompWithTable
                    title="Liste des membres"
                    btn={
                      <>
                        <div className="flex flex-col sm:flex-row">
                          <Input.Search
                            placeholder="Rechercher une cooperative"
                            className="placeholder:!text-xs mb-2 sm:mb-0"
                            onSearch={(v) => setSearchedText(v)}
                            onChange={(e) => setSearchedText(e.target.value)}
                          />
                          <div className="w-full sm:w-auto sm:ml-5">
                            <Select
                              showSearch
                              style={{ width: "100%" }}
                              placeholder="Cooperative"
                              optionFilterProp="children"
                              filterOption={(input: string, option: any) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={handleCoopChange}
                              loading={isLoadingCooperative}
                            >
                              <Option value="">Listes...</Option>
                              {dataCooperativeSelect?.data?.rows.map((item) => (
                                <Option key={item.id} value={item.id}>
                                  {item.cooperative}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </>
                    }
                    content={
                      <>
                        <Table
                          dataSource={filteredData}
                          key={activeCooperative1}
                          loading={dataAgriculteurLoard}
                          className="h-[70vh] overflow-auto"
                          columns={[
                            {
                              title: "N°",
                              dataIndex: "index",
                              key: "index",
                              render: (_, __, index) => index + 1,
                              width: "1rem",
                            },
                            {
                              title: "Membres",
                              dataIndex: "name",
                              key: "name",
                              render: (_, item) => (
                                <>
                                  <List.Item.Meta
                                    className="flex items-center gap-4"
                                    avatar={<Avatar />}
                                    title={
                                      <strong>
                                        {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} ${item?.__tbl_ecom_user?.prenom}`}
                                      </strong>
                                    }
                                    description={item?.__tbl_ecom_user?.email}
                                  />
                                </>
                              ),
                            },
                            {
                              title: "Generer Carte",
                              key: "carte",
                              dataIndex: "carte",
                              align: "center",
                              render: (_, item) => (
                                <>
                                  <Tag
                                    onClick={() => showElementToCarte(item)}
                                    color="green"
                                    className="cursor-pointer p-2"
                                  >
                                    <FaRegIdCard size={16} />
                                  </Tag>
                                </>
                              ),
                            },
                          ]}
                        />
                      </>
                    }
                  />
                </div>
              )}
            </main>
          </>
        </Col>
        <Col xs={24} md={10}>
          <Row>
            <Col span={24}>
              <div className="mt-10 ml-0 md:ml-5 relative">
                <div>
                  <Tag color="green" className="p-2 w-full text-center">
                    <h1>CARTE DU MEMBRE</h1>
                  </Tag>
                </div>
                <div className="iq-card-body h-400 flex justify-between mt-10 relative">
                  <div
                    className="absolute inset-0 h-[390px] w-full md:w-[650px] bg-cover bg-no-repeat bg-center"
                    style={{
                      backgroundImage: "url('/carte.png')",
                    }}
                    ref={ref}
                  >
                    <div className="relative w-full md:w-auto pl-[31px] pt-[105px]">
                      <div>
                        <QRCode value={numerCarte} size={120} />
                      </div>
                      <div className="mt-[19px] m-0 ml-[50px]">
                        <p className="text-green-700 m-0 font-bold p-0">{`${nom?.toUpperCase()} ${postnom?.toUpperCase()} ${prenom?.toUpperCase()}`}</p>
                        <p className="text-green-700 m-0 font-bold p-0">{idProvince?.toUpperCase()}</p>
                        <p className="text-green-700 m-0 font-bold p-0">{idTerritoire?.toUpperCase()}</p>
                        <p className="text-green-700 m-0 font-bold p-0">Village</p>
                      </div>
                      <div className="absolute top-[120px] left-[180px]">
                        <p className="text-green-700 font-bold text-2xl">
                          {String(numerCarteEncod).padStart(12, "0").replace(/(.{4})/g, "$1 ")}
                        </p>
                        <p className="text-green-700 font-bold">{categorie}</p>
                        <p className="text-[#B99450] font-bold text-lg">{formattedDate} - {dateExpiration}</p>
                      </div>
                      <div className="absolute top-[307px] left-[232px]">
                        <p className="text-green-700 font-bold">{cooperative}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-[420px] ml-0 md:ml-4">
            <Col span={24}>
              <div className="flex z-[1000]">
                {numerCarte && (
                  <div className="mr-2">
                    <Button onClick={getImage}>Générer la carte</Button>
                  </div>
                )}
                {genereated && (
                  <div>
                    <Button onClick={telecharger}>
                      <CiSaveDown2 />
                      Télécharger
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>

  )
}

export default Home